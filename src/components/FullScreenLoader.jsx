import React from 'react';
import { Spin } from 'antd';
const FullScreenLoader = () => {
    return (
        <div className='fullscreen-loader-div' style={{ textAlign: "center", position: "absolute", width: "100%", justifyContent: "center", minHeight: "100vh", alignContent: "center",  top:"0", bottom:"0"}}>
            <Spin size="large" />
        </div>
    );

}

export default FullScreenLoader;