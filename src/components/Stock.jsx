import React, { useEffect, useState } from 'react'
import { Table, Space, Input, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'


const Stock = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [companyName, setCompanyName] = useState("")
    const [unitPrice, setUnitPrice] = useState("")
    const [editUnitPrice, setEditUnitPrice] = useState("")
    const [editUnitPriceId, setEditUnitPriceId] = useState()
    const [reload, setReload] = useState(false)

    const fetchRecords = async (url) => {
    
        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {

            console.log(json)
            setData(json.sort((a,b)=>a.id - b.id ))
        

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
        },
        {
          title: 'Updated at',
          dataIndex: 'updated_at',
          key: 'updated_at',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <Space size="middle">
              <EditOutlined onClick={()=>editStock(record)}/>
              <DeleteOutlined onClick={()=>deleteStock(record)} />
            </Space>
          ),
        },
    ]
    
    const editStock = (record) => {
        console.log(record)  
        setEditVisible(true) 
        setEditUnitPrice(parseInt(record.unit_price)) 
        setEditUnitPriceId(record.id)
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
            body: JSON.stringify({name: companyName, unit_price: parseInt(unitPrice)})
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
            body: JSON.stringify({unit_price: parseInt(editUnitPrice)})
        })
        .then(response => response.json()) 
        .then(json => {
            console.log(json)
            setReload(r => !r)
        

        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            <Button type="primary" onClick={addStock} style={{marginBottom: "10px"}}>Add Stock</Button>
            <Table columns={columns} dataSource={data} />

            <Modal title="Add Stock" visible={visible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: companyName === "" || unitPrice === "" }}>
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

            <Modal title="Edit Stock" visible={editVisible} onOk={handleEdit} onCancel={handleEditCancel}>
                <Input value={editUnitPrice} onChange={(e)=> setEditUnitPrice(e.target.value)} />
            </Modal>
        </div>
    )
}

export default Stock