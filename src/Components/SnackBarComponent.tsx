import * as React from 'react'
import { ComponentBase } from 'resub'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'

export default class SnackbarComponent extends ComponentBase<any, any> {

    constructor(props: any) {
        super(props)
        this.state = { open: props.open }
    }

    public handleClose = () => {
        this.setState({
            ...this.state,
            open: false
        })
        this.props.onClose()
    }

    public render() {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: this.props.vertical,
                    horizontal: this.props.horizontal
                }}
                open={this.state.open}
                onClose={this.handleClose}
                autoHideDuration={this.props.autoHideDuration ? this.props.autoHideDuration : this.props.className === 'snackbar-success' ? 2000 : 3500}
                ContentProps={{
                    'aria-describedby': 'message-id'
                }}
            >
                <SnackbarContent
                    className={this.props.className}
                    message={<span id='message-id'>
                        {this.props.className === 'snackbar-success' ? (
                            <CheckCircleIcon style={{ fontSize: '20px', marginRight: '10px', position: 'relative', top: 5 }} />
                        ) : (
                                <ErrorIcon style={{ fontSize: '20px', marginRight: '10px', position: 'relative', top: 5 }} />
                            )}

                        {this.props.message}</span>}
                />
            </Snackbar>
        )
    }
}
