export const getBasicButtonList = (setActiveView) => [
    { 
        label: "Dashboard", 
        onClick: () => setActiveView(() => () => 
        <div style={{ backgroundColor: "black", color: "white", padding: "20px" }}>
            Dashboard
        </div>) 
    },
    { 
        label: "Profile", 
        onClick: () => setActiveView(() => () => <div>Profile</div>) 
    },
    {
        label : "My packages",
        onClick: () => setActiveView(()=>() => <div> Here are your packages</div>)
    }
];
