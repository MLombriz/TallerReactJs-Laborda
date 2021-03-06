import { createContext, useEffect, useState } from 'react'
import firebase from 'firebase/app'
import { dataBase } from '../firebase/firebase'

// creo contexto
const CartContext = createContext()

//Defino el Provider
const CartProvider = ({ children, defaultCart = [] }) => {
    const [cart, setCart] = useState(defaultCart)
    const [numberItems, setNumberItems] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [orderId, setOrderId] = useState("")

    useEffect(() => {
        const nextTotal = cart.map(({ item, quantity }) => item.price * quantity)
            .reduce((subtotalPrice, totalPriceAcum) => subtotalPrice + totalPriceAcum, 0)
        setTotalPrice(nextTotal)
    }, [cart])
    const removeItem = (itemId, quantity) => {
        const newCart = [...cart]
        const filterCart = newCart.filter(obj => obj.item.id !== itemId)
        setCart(filterCart)
        setNumberItems(parseInt(numberItems) - parseInt(quantity))
    }
    const addItem = (item, quantity) => {
        if (isInCart(item.id)) {
            console.log('Item existente en Cart.. Se sumo la cantidad elegida')
            const object = cart.find(obj => obj.item.id === item.id)
            object.quantity += quantity
            setNumberItems(parseInt(numberItems) + parseInt(quantity))
        } else {
            updateCart({ item, quantity })
            setNumberItems(parseInt(numberItems) + parseInt(quantity))
        }
    }
    const clearCart = () => {
        console.log('clearCart: Cart borrado y sin items');
        setCart(defaultCart)
        setNumberItems(0)
    }
    const isInCart = (itemId) => {
        return cart.find(obj => obj.item.id === parseInt(itemId)) ? true : false
    }
    const updateCart = (obj) => {
        setCart([...cart, obj])
    }
    const getOrder = (buyer) => {
        const orderItems = cart.map(
            ({ item, quantity }) => ({ id: item.id, title: item.title, price: item.price, quantity: quantity }))
        return {
            buyer: {
                name: buyer.name,
                surname: buyer.surname,
                mail: buyer.mail
            },
            items: orderItems,
            date: firebase.firestore.Timestamp.fromDate(new Date()),
            totalPrice,
        }
    }
    const endPurchase = (buyer) => {
        const newOrder = getOrder(buyer)
        const db = dataBase
        const orders = db.collection('orders')
        orders.add(newOrder).then(({ id }) => {
            setOrderId(id)
            alert(`id de compra Generado es: ${id}. Ya le mandamos por mail su orden y numero de seguimiento`)
        }).catch((err) => {
            console.log('Error finalizando su Compra', err)
        }).finally(() => {
            clearCart()
        })
    }

    return (
        <CartContext.Provider value={{ cart, numberItems, totalPrice, orderId, clearCart, addItem, updateCart, removeItem, endPurchase }}>
            {children}
        </CartContext.Provider>
    )
}

export { CartProvider, CartContext }