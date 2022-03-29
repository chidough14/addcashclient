import { Button, Input, Select, message } from 'antd'
import React, { useEffect, useState } from 'react'

const { Option } = Select;

const PurchaseStock = () => {
    const [clients, setClients] = useState([])
    const [stocks, setStocks] = useState([])
    const [volume, setVolume] = useState("")
    const [clientValue, setClientValue] = useState()
    const [stockValue, setStockValue] = useState()

    const fetchClients = async (url) => {
    
        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {
            setClients(json)
        

        })
        .catch(err => console.log(err));
    }

    const fetchStock = async (url) => {
    
        await fetch(url, {
            method: "GET",
            headers: {"Content-Type": "application/json"}
        })
        .then(response => response.json()) 
        .then(json => {
            setStocks(json)
        

        })
        .catch(err => console.log(err));
    }
    useEffect(() => {
        fetchClients("https://whispering-dusk-53744.herokuapp.com/api/clients")
        fetchStock("https://whispering-dusk-53744.herokuapp.com/api/stocks")
    }, [])

    const addPurchase = async () => {

        await fetch("https://whispering-dusk-53744.herokuapp.com/api/purchase", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({client_id: clientValue, stock_id: stockValue, volume: parseInt(volume)})
        })
        .then(response => response.json()) 
        .then(json => {
            message.success('Purchase successful')
            setClientValue()
            setStockValue()
            setVolume("")
         
        })
        .catch(err => console.log(err));
    }

  return (
    <div style={{width: "400px", margin: "auto",  marginTop: "20px"}}>
        <h2>Purchase a stock</h2>
        <Select placeholder="Select client" value={clientValue} style={{ width: 400, marginBottom: "20px" }} onChange={(e)=>setClientValue(e)}>
            {
                clients.map((client) => (
                    <Option value={client.id} key={client.id}>{client.name}</Option>
                ))
            }
            
        </Select>

        <Select placeholder="Select stock" value={stockValue} style={{ width: 400, marginBottom: "20px" }} onChange={(e)=> setStockValue(e)}>
            {
                stocks.map((stock) => (
                    <Option value={stock.id} key={stock.id}>{stock.name}</Option>
                ))
            }
            
        </Select>

        <Input placeholder='Volume' value={volume} onChange={(e)=> setVolume(e.target.value)} style={{ marginBottom: "20px" }} />


        <Button type='primary' onClick={addPurchase} disabled={!clientValue || !stockValue || volume === ""}>Add Purchase</Button>
    </div>
  )
}

export default PurchaseStock