import React, { useEffect, useState } from 'react'
import { Table, Space, Input, Button, Modal, Spin, Tooltip } from 'antd';
import moment from 'moment'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'


const Stock = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [editUnitPrice, setEditUnitPrice] = useState("")
    const [editUnitPriceId, setEditUnitPriceId] = useState()
    const [editItemName, setEditItemName] = useState("")
    const [reload, setReload] = useState(false)
    const [pageSpinner, setPageSpinner] = useState(false)

    const fetchRecords = async (url) => {
        setPageSpinner(true)
    
        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {

            json.map((j) => {
                j.updated_at_formated = moment(j.updated_at).format('MM/DD/YYYY')
            })

            setData(json.sort((a,b)=>b.unit_price - a.unit_price ))
            setPageSpinner(false)
        

        })
        .catch(err => console.log(err));
    }
      
    useEffect(() => {
        fetchRecords("https://whispering-dusk-53744.herokuapp.com/api/stocks")
    }, [reload])

    const columns = [
        {
          title: 'Company name',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Unit price',
          dataIndex: 'unit_price',
          key: 'unit_price',
          render: (text, record) => (
            <p >{Number(record.unit_price).toFixed(2)}</p>
          )
        },
        {
          title: 'Updated at',
          dataIndex: 'updated_at_formated',
          key: 'updated_at_formated',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <Tooltip placement="top" title={`Edit stock price : ${record.name}`}><EditOutlined onClick={()=>editStock(record)}/></Tooltip>
              <Tooltip placement="top" title={`Delete stock price : ${record.name}`}><DeleteOutlined onClick={()=>deleteStock(record)} /></Tooltip>
            </Space>
          ),
        },
    ]
    
    const editStock = (record) => {
        setEditVisible(true) 
        setEditUnitPrice(parseFloat(record.unit_price)) 
        setEditUnitPriceId(record.id)
        setEditItemName(record.name)
    }

    const deleteStock = async (record) => {

        await fetch(`https://whispering-dusk-53744.herokuapp.com/api/deleteStock/${record.id}`, {
            method: "DELETE"
        })

        setReload(r => !r)
    }

    const addStock = () => {
        setVisible(true)
    }

    const handleOk = async () => {
        

        await fetch("https://whispering-dusk-53744.herokuapp.com/api/stock", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: companyName, unit_price: parseFloat(unitPrice)})
        })
        .then(response => response.json()) 
        .then(json => {
            setCompanyName("")
            setUnitPrice("")
            setReload(r => !r)
            setVisible(false);
         
        })
        .catch(err => console.log(err));
    }

    const handleCancel = () => {
        setVisible(false);
        setCompanyName("")
        setUnitPrice("")
    }

    const handleEditCancel = () => {
        setEditVisible(false);
    }

    const handleEdit = async () => {
        setEditVisible(false);

        await fetch(`https://whispering-dusk-53744.herokuapp.com/api/editStock/${editUnitPriceId}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({unit_price: parseFloat(editUnitPrice)})
        })
        .then(response => response.json()) 
        .then(json => {
           
            setReload(r => !r)
        

        })
        .catch(err => console.log(err));
    }

    return (
        <div style={{ width: "1000px", margin: "auto"}}>
            <h2>Stocks</h2>
            <Button type="primary" onClick={addStock} style={{marginBottom: "10px"}}>Add Stock</Button>
            <Table columns={columns} dataSource={data} loading={{ indicator: <div><Spin size='large' /></div>, spinning: pageSpinner}}  />

            <Modal 
               title="Add Stock" 
               visible={visible} 
               onOk={handleOk} 
               onCancel={handleCancel} 
               okButtonProps={{ disabled: companyName === "" || unitPrice === "" }}
               okText="Save"
            >
                <Input 
                   placeholder="Company name" 
                   value={companyName} style={{marginBottom: "10px"}} 
                   onChange={(e)=> setCompanyName(e.target.value)}  
                />
                <Input 
                   placeholder="Unit Price" 
                   value={unitPrice} 
                   onChange={(e)=> setUnitPrice(e.target.value)} 
                />
            </Modal>

            <Modal title={`Edit stock price : ${editItemName}`} visible={editVisible} onOk={handleEdit} onCancel={handleEditCancel}>
                <Input value={editUnitPrice} onChange={(e)=> setEditUnitPrice(e.target.value)} />
            </Modal>
        </div>
    )
}

export default Stock