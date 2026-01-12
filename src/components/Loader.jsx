import './Loader.css'

function Loader({ message = 'Loading...' }) {
    return (
        <div className="auth-loader-overlay active">
            <div className="loader-content">
                <div className="spinner">
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                    <div className="spinner-ring"></div>
                </div>
                <div className="loader-text">{message}</div>
            </div>
        </div>
    )
}

export default Loader
