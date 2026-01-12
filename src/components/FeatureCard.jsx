import { useNavigate } from 'react-router-dom'
import './FeatureCard.css'

function FeatureCard({
    icon,
    iconColor = 'blue',
    title,
    description,
    linkText = 'Learn more',
    to,
    onClick
}) {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick()
        } else if (to) {
            navigate(to)
        }
    }

    return (
        <div className="feature-card-dashboard" onClick={handleClick}>
            <div className="feature-card-header">
                <div className={`feature-icon-wrapper ${iconColor}`}>
                    {typeof icon === 'string' ? (
                        <img src={icon} alt={title} className="feature-icon" />
                    ) : (
                        icon
                    )}
                </div>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="feature-action">
                <span>{linkText}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </div>
        </div>
    )
}

export default FeatureCard
