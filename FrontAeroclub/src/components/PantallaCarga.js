import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";


const PantallaCarga = () => {
    return (
        <div className="background"> 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <ProgressSpinner 
            style={{width: '70px', height: '70px'}}
            strokeWidth="5"
            strokeColor="red"
            /> 
          </div>
        </div>
    );
};

export default PantallaCarga;