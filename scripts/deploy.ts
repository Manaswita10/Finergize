// scripts/deploy.ts
import { ethers } from "ethers";
import * as hre from "hardhat";

async function main() {
    try {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = provider.getSigner();
        console.log("Deploying with account:", await signer.getAddress());

        const MutualFundInvestment = await hre.artifacts.readArtifact("MutualFundInvestment");
        const factory = new ethers.ContractFactory(
            MutualFundInvestment.abi,
            MutualFundInvestment.bytecode,
            signer
        );

        console.log("Deploying MutualFundInvestment...");
        const mutualFund = await factory.deploy();
        await mutualFund.deployed();

        console.log("MutualFundInvestment deployed to:", mutualFund.address);

        const mutualFundsData = [
            {
                id: "LARGE_CAP_001",
                name: "Large Cap Growth Fund",
                nav: ethers.utils.parseEther("45.67"),
                aum: ethers.utils.parseEther("1200")
            },
            {
                id: "MID_CAP_002",
                name: "Mid Cap Opportunities",
                nav: ethers.utils.parseEther("68.92"),
                aum: ethers.utils.parseEther("800")
            },
            {
                id: "DEBT_003",
                name: "Debt Fund Direct",
                nav: ethers.utils.parseEther("28.34"),
                aum: ethers.utils.parseEther("1500")
            },
            {
                id: "BAL_ADV_004",
                name: "Balanced Advantage Fund",
                nav: ethers.utils.parseEther("35.45"),
                aum: ethers.utils.parseEther("2200")
            },
            {
                id: "SMALL_CAP_005",
                name: "Small Cap Discovery Fund",
                nav: ethers.utils.parseEther("89.23"),
                aum: ethers.utils.parseEther("600")
            },
            {
                id: "GOVT_SEC_006",
                name: "Government Securities Fund",
                nav: ethers.utils.parseEther("25.67"),
                aum: ethers.utils.parseEther("3500")
            },
            {
                id: "DYN_ASSET_007",
                name: "Dynamic Asset Allocation Fund",
                nav: ethers.utils.parseEther("42.78"),
                aum: ethers.utils.parseEther("1800")
            }
        ];

        console.log("\nAdding mutual funds to the contract...");

        for (const fund of mutualFundsData) {
            try {
                console.log(`Adding fund ${fund.name} with ID ${fund.id}...`);
                const tx = await mutualFund.addFund(
                    fund.id,
                    fund.name,
                    fund.nav,
                    fund.aum
                );
                await tx.wait();
                console.log(`Added fund: ${fund.name}`);

                // Verify fund was added correctly
                const fundData = await mutualFund.funds(fund.id);
                console.log(`Verified fund ${fund.name}:`, {
                    active: fundData.active,
                    nav: ethers.utils.formatEther(fundData.nav),
                    aum: ethers.utils.formatEther(fundData.aum)
                });
            } catch (error) {
                console.error(`Error adding fund ${fund.name}:`, error);
                throw error; // Re-throw to stop the deployment if a fund fails to add
            }
        }

        // Verify all funds were added
        const totalFunds = await mutualFund.totalFunds();
        console.log(`\nTotal funds added: ${totalFunds}`);

        const allFunds = await mutualFund.getAllFunds();
        console.log("\nAll funds status:");
        allFunds.forEach((fund: any, index: number) => {
            console.log(`${index + 1}. ${fund.name}:`);
            console.log(`   - ID: ${fund.fundId}`);
            console.log(`   - Active: ${fund.active}`);
            console.log(`   - NAV: ${ethers.utils.formatEther(fund.nav)}`);
            console.log(`   - AUM: ${ethers.utils.formatEther(fund.aum)}`);
        });

        console.log("\nContract is ready for investments!");
        
        // Save the deployment information
        const deploymentInfo = {
            contractAddress: mutualFund.address,
            funds: mutualFundsData.map(fund => ({
                ...fund,
                nav: ethers.utils.formatEther(fund.nav),
                aum: ethers.utils.formatEther(fund.aum)
            }))
        };

        console.log("\nDeployment information:", deploymentInfo);
        
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });