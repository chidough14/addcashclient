import React, { useEffect, useState } from 'react'
import { Table, Space, Input, Button, Modal } from 'antd';

const Client = () => {
    const [data, setData] = useState([])
    const [visible, setVisible] = useState(false)
    const [clientName, setClientName] = useState("")
    const [reload, setReload] = useState(false)

    const columns = [
        {
          title: 'Client',
          dataIndex: 'name',
          key: 'name',
          render: text => <a>{text}</a>,
        },
        {
          title: 'Cash balance',
          dataIndex: 'investment',
          key: 'investment',
        },
        {
          title: 'Gain/Loss',
          dataIndex: 'gain_loss',
          key: 'gain_loss',
        },
        {
          title: 'Action',
          key: 'action',
          render: (text, record) => (
            <p>View</p>
          ),
        },
    ]

    const fetchRecords = async (url) => {
    
        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {

            console.log(json)
            setData(json.sort((a,b)=>a.gain_loss - b.gain_loss ))
        

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

            console.log(json)
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
        <div>
            <Button type="primary" onClick={addClient} style={{marginBottom: "10px"}}>Add Stock</Button>
            <Table columns={columns} dataSource={data} />

            <Modal title="Add Stock" visible={visible} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ disabled: clientName === ""  }}>
                <Input 
                   placeholder="Client name" 
                   value={clientName} 
                   style={{marginBottom: "10px"}} 
                   onChange={(e)=> setClientName(e.target.value)}  
                />
            </Modal>
        </div>
    )
}

export default Client