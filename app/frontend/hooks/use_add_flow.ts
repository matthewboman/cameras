import { useState } from 'react'

export default function useAddFlow() {
  const [addMode, setAddMode]         = useState(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [position, setPosition]       = useState(null)
  const [address, setAddress]         = useState(null)

  const resetFlow = () => {
    setAddMode(null)
    setShowAddMenu(false)
    setShowAddress(false)
    setPosition(null)
    setAddress(null)
  }

  return {
    addMode,
    setAddMode,
    showAddMenu,
    setShowAddMenu,
    showAddress,
    setShowAddress,
    position,
    setPosition,
    address,
    setAddress,
    resetFlow
  }
}
