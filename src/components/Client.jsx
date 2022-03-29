import React, { useEffect, useState } from 'react'
import { Table, Spin, Input, Button, Modal } from 'antd';

const Client = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [clientName, setClientName] = useState("")
    const [reload, setReload] = useState(false)
    const [showStockModal, setShowStockModal] = useState(false)
    const [stockData, setStockData] = useState([])
    const [modalClient, setModalClient] = useState()
    const [spinner, setSpinner] = useState(false)
    const [pageSpinner, setPageSpinner] = useState(false)
    const [total, setTotal] = useState()
    const [totalInvestment, setTotalInvestment] = useState()

    const columns = [
        {
          title: 'Client',
          dataIndex: 'name',
          key: 'name',
          render: text => <p>{text}</p>,
        },
        {
          title: 'Cash balance',
          dataIndex: 'investment',
          key: 'investment',
          render: (text, record) => (
            <p>$ {Number(record.investment).toFixed(2)}</p>
          )
        },
        {
          title: 'Gain/Loss',
          key: 'gain_loss',
          render: (text, record) => (
            <p style={{color: record.gain_loss > 0 ? "green" : record.gain_loss < 0 ? "red" : "" }}>
               {record.gain_loss > 0 ? "+" : record.gain_loss < 0 ? "-" : ""}${Math.abs(Number(record.gain_loss)).toFixed(2)}
            </p>
          )
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Button type="primary" onClick={()=>showStocks(record)}>View stocks</Button>
          ),
        },
    ]


    const stockColumns = [
        {
          title: 'Company',
          dataIndex: 'company_name',
          key: 'company_name',
        },
        {
          title: 'Volume',
          dataIndex: 'volume',
          key: 'volume',
        },
        {
          title: 'Purchasing price',
          dataIndex: 'purchase_price',
          key: 'purchase_price',
          render: (text, record) => (
            <p>$ {Number(record.purchase_price).toFixed(2)}</p>
          )
        },
        {
            title: 'Current price',
            dataIndex: 'current_price',
            key: 'current_price',
            render: (text, record) => (
                <p>$ {Number(record.current_price).toFixed(2)}</p>
            )
        },
        {
            title: 'Gain/Loss',
            dataIndex: 'gain_loss',
            key: 'gain_loss',
            render: (text, record) => (
                <p style={{color: record.gain_loss > 0 ? "green" : record.gain_loss < 0 ? "red" : "" }}>{record.gain_loss > 0 ? "+" : record.gain_loss < 0 ? "-" : ""}$ {Math.abs(Number(record.gain_loss)).toFixed(2)}</p>
            )
        },
        
    ]


    const showStocks = async (record) => {
        setShowStockModal(true)
        setModalClient(record)
        setStockData([])
        setSpinner(true)

        await fetch(`https://whispering-dusk-53744.herokuapp.com/api/purchases/${record.id}`, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {

            
            setStockData(json.sort((a,b)=>b.gain_loss - a.gain_loss ))
            setSpinner(false)

            setTotal(json.reduce((n, {gain_loss}) => n + gain_loss, 0))

            json.map((j) => {
                j.investment = j.volume * parseFloat(j.purchase_price)
            })

            let total_investment = json.reduce((n, {investment}) => n + investment, 0)

            setTotalInvestment(total_investment)
        

        })
        .catch(err => console.log(err));
    }

    const fetchRecords = async (url) => {
        setPageSpinner(true)

        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {

            setData(json.sort((a,b)=>b.gain_loss - a.gain_loss ))
            setPageSpinner(false)
        

        })
        .catch(err => console.log(err));
    }

    useEffect(() => {
        fetchRecords("https://whispering-dusk-53744.herokuapp.com/api/clients")
    }, [reload])

    const addClient = () => {
        setVisible(true)
    }

    const handleOk = async () => {
        
        await fetch("https://whispering-dusk-53744.herokuapp.com/api/client", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: clientName})
        })
        .then(response => response.json()) 
        .then(json => {
            setReload(r => !r)
            setVisible(false)
            setClientName("")
        

        })
        .catch(err => console.log(err));
    }

    const handleCancel = () => {
        setVisible(false)
        setClientName("")
    }

    return (
        <div style={{ width: "1000px", margin: "auto"}}>
            <h2>Clients</h2>
            <Button type="primary" onClick={addClient} style={{marginBottom: "10px"}}>Add Client</Button>
            <Table columns={columns} dataSource={data} loading={{ indicator: <div><Spin size='large' /></div>, spinning: pageSpinner}} />

            <Modal title="Add Client" visible={visible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: clientName === ""  }} okText="Save">
                <Input 
                   placeholder="Client name" 
                   value={clientName} 
                   style={{marginBottom: "10px"}} 
                   onChange={(e)=> setClientName(e.target.value)}  
                />
            </Modal>


            <Modal 
               title={`List Client stocks  ${modalClient?.name}`} 
               visible={showStockModal} 
               onOk={()=>setShowStockModal(false)} 
               width={1000}
               cancelButtonProps={{hidden: true}} 
               closable={false}
            >
                <Table columns={stockColumns} dataSource={stockData} loading={{ indicator: <div><Spin /></div>, spinning: spinner}} pagination={false} />



                <table style={{marginTop: "12px"}}>
                    <tr >
                        <td style={{textAlign: "right"}}><p style={{fontSize: "16px"}}><b>Total</b> &nbsp;  </p></td>
                        <td>
                            <p style={{fontSize: "16px", color: total > 0 ? "green" : total < 0 ? "red" : ""}}> 
                            {total > 0 ? "+" : total < 0 ? "-" : ""}${Math.abs(Number(total)).toFixed(2)}
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style={{textAlign: "right"}}><p style={{fontSize: "16px"}}><b>Investment</b> &nbsp; </p></td>
                        <td><p style={{fontSize: "16px"}}>${Number(totalInvestment).toFixed(2)}</p></td>
                    </tr>

                    <tr>
                        <td><p style={{fontSize: "16px"}}> <b>Perfomance</b>&nbsp; </p></td>
                        <td>
                            <p 
                                style={{fontSize: "16px", color: (total / totalInvestment) > 0 ? "green" : (total / totalInvestment) < 0 ? "red" : ""  }}
                            >
                            {(total / totalInvestment) > 0 ? "+" : ""}{isNaN(Math.round((total / totalInvestment) * 100) / 100) ? 0 :  Math.round((total / totalInvestment) * 100) / 100} %
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td><p style={{fontSize: "16px"}}><b>Cash Balance</b> &nbsp;</p></td>
                        <td>
                           <p style={{fontSize: "16px"}}> $ { Number(modalClient?.investment).toFixed(2)}</p>
                        </td>
                    </tr>
                </table>
            </Modal>
        </div>
    )
}

export default Client