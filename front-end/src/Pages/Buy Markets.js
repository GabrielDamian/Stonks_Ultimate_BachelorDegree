// !!!!!!!!! ----->>> DEPRECATED Component, 

import React, { Component } from 'react';
import './Style/BuyMarkets.css';
import LeftMenu from '../Components/Organisms/LeftMenu';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TopBar from '../Components/Organisms/TopBar';

function createData(name, calories, fat, ) {
    return { name, calories, fat};
}
const rows = [
    createData('BTC', '25/12/2019'),
    createData('BTC', '25/12/2019'),
    createData('BTC', '25/12/2019'),
    createData('BTC', '25/12/2019'),
    createData('BTC', '25/12/2019'),
  ];

const newRows = [
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
    createData('ETH', 200, '5$'),
]
function BuyMarkets({tabIndex,setTabs,tabs}){
    return(
        <div className='buy-market-container'>
             <LeftMenu tabIndex={tabIndex} setTabs={setTabs} tabs={tabs}/>
            <div className='dashboard-content'>
                <TopBar />
                <div className="buy-market-content-data">
                    <div className="buy-market-content-data-own">
                        <div className="buy-market-content-data-own-header">
                            <span>Owned markets:</span>
                        </div>
                        <div className="buy-market-content-data-own-content">
                        <TableContainer component={Paper} sx={{width:'100%'}}>
                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Date unlocked</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {rows.map((row) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div className="buy-market-content-data-new">
                        <div className="buy-market-content-data-new-header">
                            <span>Buy new market access:</span>
                        </div>
                        <div className="buy-market-content-data-new-content">
                        <TableContainer component={Paper} sx={{width:'100%'}}>
                            <Table sx={{ width: '100%' }} aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell >Name</TableCell>
                                    <TableCell align="right">Date added</TableCell>
                                    <TableCell align="right">Price now:</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {newRows.map((row) => (
                                    <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.calories}</TableCell>
                                    <TableCell align="right">{row.fat}</TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained">Unlock</Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>
    )
}
export default BuyMarkets;
