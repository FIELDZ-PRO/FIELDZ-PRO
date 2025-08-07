import React from 'react'
import './style/StepItem.css'

interface StepItemProps {
  icon: React.ReactNode
  number: string
  title: string
  description: string
}

const StepItem: React.FC<StepItemProps> = ({ icon, number, title, description }) => (
  <div className="step-item">
    <div className="step-item__icon">{icon}</div>
    <div className="step-item__number">{number}</div>
    <h4 className="step-item__title">{title}</h4>
    <p className="step-item__desc">{description}</p>
  </div>
)

export default StepItem
