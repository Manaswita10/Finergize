// services/blockchain.service.ts
import { ethers } from 'ethers';
import { MUTUAL_FUND_ADDRESS } from '@/config/contract';
import { abi } from '../artifacts/contracts/MutualFundInvestment.sol/MutualFundInvestment.json';

interface Investment {
    investmentId: string;
    fundId: string;
    amount: string;
    timestamp: Date;
    investmentType: string;
    sipDay: number;
    active: boolean;
    units: string;
}

export class BlockchainService {
    private provider: ethers.providers.Provider;
    private contract: ethers.Contract;
    private signer: ethers.Signer | null = null;

    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        this.contract = new ethers.Contract(
            MUTUAL_FUND_ADDRESS,
            abi,
            this.provider
        );
        this.setupProviderErrorHandling();
    }

    private setupProviderErrorHandling() {
        if (this.provider instanceof ethers.providers.Web3Provider) {
            this.provider.on('error', (error) => {
                console.error('Provider error:', error);
                this.handleProviderError(error);
            });
        }
    }

    private async handleProviderError(error: any) {
        if (error.message.includes('invalid block tag')) {
            try {
                this.provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
                this.contract = new ethers.Contract(
                    MUTUAL_FUND_ADDRESS,
                    abi,
                    this.provider
                );
                if (this.signer) {
                    this.contract = this.contract.connect(this.signer);
                }
            } catch (reconnectError) {
                console.error('Failed to reconnect:', reconnectError);
                throw new Error('Network synchronization error. Please try again.');
            }
        }
    }

    async connectWallet(): Promise<string> {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed');
        }

        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
            
            // Get network details
            const network = await web3Provider.getNetwork();
            console.log('Connected to network:', network);

            // Accept Hardhat Local network
            if (network.chainId !== 31337) {
                throw new Error('Please connect to Hardhat Local network');
            }

            this.signer = web3Provider.getSigner();
            this.contract = this.contract.connect(this.signer);
            
            const address = await this.signer.getAddress();
            console.log('Connected to wallet:', address);
            return address;
        } catch (error) {
            console.error('Wallet connection error:', error);
            if (error.code === -32002) {
                throw new Error('MetaMask connection pending. Please check your MetaMask');
            }
            throw error;
        }
    }

    async checkFundStatus(fundId: string) {
        try {
            console.log('Checking fund status for:', fundId);
            // Use latest block to avoid synchronization issues
            const fund = await this.contract.funds(fundId, { blockTag: 'latest' });
            return {
                exists: true,
                isActive: fund.active,
                name: fund.name,
                nav: ethers.utils.formatEther(fund.nav),
                aum: ethers.utils.formatEther(fund.aum)
            };
        } catch (error) {
            console.error('Error checking fund status:', error);
            return {
                exists: false,
                isActive: false,
                name: '',
                nav: '0',
                aum: '0'
            };
        }
    }

    async getAllFunds() {
        try {
            // Wait for provider to be ready and get latest block
            await this.provider.ready;
            const latestBlock = await this.provider.getBlockNumber();
            console.log('Latest block number:', latestBlock);

            // Use latest block to avoid synchronization issues
            const funds = await this.contract.getAllFunds({ blockTag: 'latest' });
            
            return funds.map((fund: any) => ({
                fundId: fund.fundId,
                name: fund.name,
                nav: ethers.utils.formatEther(fund.nav),
                aum: ethers.utils.formatEther(fund.aum),
                active: fund.active
            }));
        } catch (error: any) {
            console.error('Error fetching funds:', error);
            
            if (error.message.includes('invalid block tag')) {
                // If we get an invalid block tag, retry after a short delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                try {
                    const funds = await this.contract.getAllFunds({ blockTag: 'latest' });
                    return funds.map((fund: any) => ({
                        fundId: fund.fundId,
                        name: fund.name,
                        nav: ethers.utils.formatEther(fund.nav),
                        aum: ethers.utils.formatEther(fund.aum),
                        active: fund.active
                    }));
                } catch (retryError) {
                    console.error('Retry error:', retryError);
                    throw new Error('Failed to fetch funds after retry');
                }
            }
            
            throw new Error('Failed to fetch funds: ' + error.message);
        }
    }

    async invest(fundId: string, amount: number, investmentType: 'LUMPSUM' | 'SIP', sipDay: number = 1) {
        if (!this.signer) {
            throw new Error('Please connect wallet first');
        }

        try {
            console.log('Starting investment with params:', { fundId, amount, investmentType, sipDay });

            if (amount <= 0) {
                throw new Error('Investment amount must be greater than 0');
            }

            const address = await this.signer.getAddress();
            const balance = await this.provider.getBalance(address);
            const amountInWei = ethers.utils.parseEther(amount.toString());

            console.log('Investment details:', {
                userAddress: address,
                userBalance: ethers.utils.formatEther(balance),
                investmentAmount: amount,
                amountInWei: amountInWei.toString()
            });

            if (balance.lt(amountInWei)) {
                throw new Error(`Insufficient balance. You have ${ethers.utils.formatEther(balance)} ETH but trying to invest ${amount} ETH`);
            }

            // Check fund status using latest block
            const fund = await this.contract.funds(fundId, { blockTag: 'latest' });
            if (!fund.active) {
                throw new Error(`Fund ${fundId} is not active`);
            }

            // Wait for provider to be ready
            await this.provider.ready;

            // Get latest block for proper synchronization
            const currentBlock = await this.provider.getBlockNumber();
            console.log('Current block number:', currentBlock);

            // Estimate gas with retry mechanism
            let gasEstimate;
            try {
                gasEstimate = await this.contract.estimateGas.invest(
                    fundId,
                    amountInWei,
                    investmentType,
                    sipDay,
                    { value: amountInWei }
                );
            } catch (gasError) {
                console.error('Gas estimation failed, using default:', gasError);
                gasEstimate = ethers.BigNumber.from('500000'); // Default gas limit
            }

            // Add 50% buffer to gas estimate
            const gasLimit = gasEstimate.mul(150).div(100);
            console.log('Gas limit set to:', gasLimit.toString());

            const tx = await this.contract.invest(
                fundId,
                amountInWei,
                investmentType,
                sipDay,
                { 
                    value: amountInWei,
                    gasLimit
                }
            );

            console.log('Transaction sent:', tx.hash);
            const receipt = await tx.wait(1); // Wait for 1 confirmation
            console.log('Transaction confirmed:', receipt);
            return receipt;
        } catch (error: any) {
            console.error('Investment error details:', {
                error: error,
                message: error.message,
                code: error.code,
                data: error.data,
                reason: error.reason,
                method: error.method,
                transaction: error.transaction
            });

            if (error.message.includes('invalid block tag')) {
                throw new Error('Network synchronization error. Please try again in a few moments.');
            }
            
            if (error.code === 'INSUFFICIENT_FUNDS') {
                throw new Error('Insufficient funds to complete the transaction');
            }
            
            if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                throw new Error('Unable to estimate gas. The transaction may fail.');
            }

            throw new Error(`Investment failed: ${error.message}`);
        }
    }

    async getUserInvestments(address: string): Promise<Investment[]> {
        try {
            // First check if address is valid
            if (!ethers.utils.isAddress(address)) {
                throw new Error('Invalid address');
            }

            console.log('Fetching investments for address:', address);
            const investments = await this.contract.getUserInvestments(address, { blockTag: 'latest' });
            console.log('Raw investments:', investments);

            // Safety check for undefined or null investments
            if (!investments) {
                console.log('No investments found');
                return [];
            }

            // Map and filter out invalid investments
            const formattedInvestments = investments
                .map((inv: any) => {
                    try {
                        // Verify required fields exist
                        if (!inv || !inv.investmentId || !inv.amount) {
                            console.log('Skipping invalid investment:', inv);
                            return null;
                        }

                        // Format the timestamp
                        let timestamp: Date;
                        try {
                            const timestampNum = inv.timestamp.toNumber ? inv.timestamp.toNumber() : Number(inv.timestamp);
                            timestamp = new Date(timestampNum * 1000);
                        } catch (error) {
                            console.error('Error formatting timestamp:', error);
                            timestamp = new Date();
                        }

                        // Format the investment
                        return {
                            investmentId: inv.investmentId.toString(),
                            fundId: inv.fundId.toString(),
                            amount: ethers.utils.formatEther(inv.amount),
                            timestamp: timestamp,
                            investmentType: inv.investmentType || 'LUMPSUM',
                            sipDay: inv.sipDay ? (inv.sipDay.toNumber ? inv.sipDay.toNumber() : Number(inv.sipDay)) : 1,
                            active: Boolean(inv.active),
                            units: inv.units ? ethers.utils.formatEther(inv.units) : '0'
                        };
                    } catch (error) {
                        console.error('Error formatting investment:', error);
                        return null;
                    }
                })
                .filter((inv): inv is Investment => inv !== null);

            console.log('Formatted investments:', formattedInvestments);
            return formattedInvestments;

        } catch (error) {
            console.error('Error fetching user investments:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Failed to fetch investments: ${errorMessage}`);
        }
    }

    async getFundBalance(address: string, fundId: string) {
        try {
            const balance = await this.contract.getFundBalance(address, fundId, { blockTag: 'latest' });
            return ethers.utils.formatEther(balance);
        } catch (error) {
            console.error('Error fetching fund balance:', error);
            throw new Error('Failed to fetch fund balance: ' + (error as Error).message);
        }
    }

    async withdrawInvestment(investmentId: string, amount: string) {
        if (!this.signer) {
            throw new Error('Please connect wallet first');
        }

        try {
            const amountInWei = ethers.utils.parseEther(amount);
            
            const gasEstimate = await this.contract.estimateGas.withdraw(investmentId, amountInWei);
            const gasLimit = gasEstimate.mul(150).div(100);

            const tx = await this.contract.withdraw(investmentId, amountInWei, { gasLimit });
            console.log('Withdrawal transaction sent:', tx.hash);
            const receipt = await tx.wait(1);
            console.log('Withdrawal confirmed:', receipt);
            return receipt;
        } catch (error: any) {
            console.error('Withdrawal error:', error);
            throw new Error('Failed to withdraw: ' + error.message);
        }
    }

    async cancelSIP(investmentId: string) {
        if (!this.signer) {
            throw new Error('Please connect wallet first');
        }

        try {
            const gasEstimate = await this.contract.estimateGas.cancelSIP(investmentId);
            const gasLimit = gasEstimate.mul(150).div(100);

            const tx = await this.contract.cancelSIP(investmentId, { gasLimit });
            console.log('SIP cancellation transaction sent:', tx.hash);
            const receipt = await tx.wait(1);
            console.log('SIP cancellation confirmed:', receipt);
            return receipt;
        } catch (error: any) {
            console.error('SIP cancellation error:', error);
            throw new Error('Failed to cancel SIP: ' + error.message);
        }
    }

    isWalletConnected(): boolean {
        return this.signer !== null;
    }

    async getConnectedAddress(): Promise<string | null> {
        try {
            if (this.signer) {
                return await this.signer.getAddress();
            }
            return null;
        } catch {
            return null;
        }
    }

    addWalletListeners() {
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    this.signer = null;
                    window.dispatchEvent(new Event('walletDisconnected'));
                } else {
                    this.connectWallet()
                        .then(() => window.dispatchEvent(new Event('walletChanged')))
                        .catch(console.error);
                }
            });

            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }
}

export default new BlockchainService();