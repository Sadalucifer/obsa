import React from 'react'
import { ImageAssets } from '../../Assets/index'
import './PageLoader.style.css'

export default class PageLoader extends React.Component<any, {}> {
    render() {
        return (
            <div className='page-loader-holder' style={{ backgroundColor: this.props.isNotTransparent ? '#ffffff' : 'rgba(59, 59, 59, 0.795)' }}>
                <img src={ImageAssets.ic_loader} alt='loader' style={{ height: 75, width: 75 }}></img>
            </div>
        )
    }
}
