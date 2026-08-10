import '../../App.css';
import animation from '/src/assets/delivery-truck-animation.gif';
function WelcomeView() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            gap: '40px', 
            color: '#222f68',
            padding: '20px'
        }}>
            <img 
                src={animation}
                alt="Delivery" 
                style={{ width: '300px', borderRadius: '10px' }} 
            />
            
            <div style={{ textAlign: 'left' }}>
                <h1>Welcome to Dynamic Delivery System</h1>
                <p>Select an option to get started</p>
            </div>
        </div>
    );
}

export default WelcomeView;