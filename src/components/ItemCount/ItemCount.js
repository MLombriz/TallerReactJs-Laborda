import React, { useState } from 'react'
import './ItemCount.css'

const ItemCount = ({ initial = 1, stock, onAdd }) => {
    const [quantity, setQuantity] = useState(parseInt(stock === 0 ? stock : initial))
    const handleCount = (operator) => {
        if (operator === '+') {
            if ((quantity < stock) && (quantity > 0)) {
                setQuantity(quantity + 1)
            }
        }
        else if (operator === '-') {
            if (quantity > 0) {
                setQuantity(quantity - 1)
            }
        }
    }

    return (
        <div className="ItemCount">
            <div className='Counter-div'>
                <button className={stock === 0 ? 'btnStockNull' : 'btnCount'} onClick={() => handleCount('-')} disabled={stock === 0}><span>-</span></button>
                <span>{quantity}</span>
                <button className={stock === 0 ? 'btnStockNull' : 'btnCount'} onClick={() => handleCount('+')} disabled={stock === 0}><span>+</span></button>
            </div>
            <button id='btnAdd' className={stock === 0 ? 'stockNull' : 'btn-carrito'} disabled={stock === 0} onClick={() => onAdd(quantity)}>Agregar al Carrito</button>
        </div >
    )
}

export { ItemCount }