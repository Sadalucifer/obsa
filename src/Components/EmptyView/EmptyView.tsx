import React from 'react'
import './EmptyView.css'

export class EmptyView extends React.Component<any, {}> {

    public render() {
        return (
            <div className='onboardify-empty-view-holder' >
                <h4 className='text-center'>
                    No Records to display
                </h4>
            </div >
        )
    }
}
