import React from 'react'

const Reservas = ({isOpen, onClose}) => {
  return (
    <div>
        <button onClick={onClose}>✕.</button>
    </div>
  )
}

export default Reservas