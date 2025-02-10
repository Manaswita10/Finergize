// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MutualFundInvestment is Ownable, ReentrancyGuard {
    struct Investment {
        uint256 amount;
        uint256 timestamp;
        string investmentType; // "LUMPSUM" or "SIP"
        uint8 sipDay;
        bool active;
        string fundId;
    }

    struct Fund {
        string fundId;
        string name;
        uint256 nav;
        uint256 aum;
        bool active;
    }

    mapping(address => Investment[]) public userInvestments;
    mapping(string => Fund) public funds;
    mapping(address => mapping(string => uint256)) public userFundBalance;
    mapping(uint256 => string) public fundIds;
    uint256 public totalFunds;

    event InvestmentMade(
        address indexed user,
        string fundId,
        uint256 amount,
        string investmentType,
        uint256 timestamp
    );

    event SIPScheduled(
        address indexed user,
        string fundId,
        uint256 amount,
        uint8 sipDay
    );

    constructor() {}

    function invest(
        string memory _fundId,
        uint256 _amount,
        string memory _investmentType,
        uint8 _sipDay
    ) external payable nonReentrant {
        require(funds[_fundId].active, "Fund not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(
            keccak256(bytes(_investmentType)) == keccak256(bytes("LUMPSUM")) ||
            keccak256(bytes(_investmentType)) == keccak256(bytes("SIP")),
            "Invalid investment type"
        );

        Investment memory newInvestment = Investment({
            amount: _amount,
            timestamp: block.timestamp,
            investmentType: _investmentType,
            sipDay: _sipDay,
            active: true,
            fundId: _fundId
        });

        userInvestments[msg.sender].push(newInvestment);
        userFundBalance[msg.sender][_fundId] += _amount;

        emit InvestmentMade(
            msg.sender,
            _fundId,
            _amount,
            _investmentType,
            block.timestamp
        );

        if (keccak256(bytes(_investmentType)) == keccak256(bytes("SIP"))) {
            emit SIPScheduled(msg.sender, _fundId, _amount, _sipDay);
        }
    }

    function getUserInvestments(address _user)
        external
        view
        returns (Investment[] memory)
    {
        return userInvestments[_user];
    }

    function getFundBalance(address _user, string memory _fundId)
        external
        view
        returns (uint256)
    {
        return userFundBalance[_user][_fundId];
    }

    function addFund(
        string memory _fundId,
        string memory _name,
        uint256 _nav,
        uint256 _aum
    ) external onlyOwner {
        funds[_fundId] = Fund({
            fundId: _fundId,
            name: _name,
            nav: _nav,
            aum: _aum,
            active: true
        });
        fundIds[totalFunds] = _fundId;
        totalFunds++;
    }

    function updateFundNAV(string memory _fundId, uint256 _newNAV)
        external
        onlyOwner
    {
        require(funds[_fundId].active, "Fund not active");
        funds[_fundId].nav = _newNAV;
    }

    function getAllFunds() external view returns (Fund[] memory) {
        Fund[] memory allFunds = new Fund[](totalFunds);
        for(uint256 i = 0; i < totalFunds; i++) {
            string memory fundId = fundIds[i];
            allFunds[i] = funds[fundId];
        }
        return allFunds;
    }
}