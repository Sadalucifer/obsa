import React from 'react'
import './HomeComponent.style.css'
import Drawer from '@material-ui/core/Drawer'
import { IconButton, AppBar, Toolbar, Typography, ListItemText } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import ListItem from '@material-ui/core/ListItem'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ImageAssets } from '../../Assets/index'
import Divider from '@material-ui/core/Divider'
import { NavLink } from 'react-router-dom'
import { ComponentBase } from 'resub'
import { HomeViewModel, HomeState } from '../../ViewModels/HomeViewModel'
import { DependencyInjector } from '../../DependencyInjector/DependencyInjector'

export class HomeComponent extends ComponentBase<any, HomeState> {
    viewModel: HomeViewModel

    constructor(props: any) {
        super(props)
        this.viewModel = DependencyInjector.default().provideHomeViewModel()
    }

    handleSideMenuOpen = () => {
        this.viewModel.set('isSideOpened', true)
    }

    render() {
        return (
            <div className={'root'} style={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar style={{ height: 70, backgroundColor: '#fd8f78' }} >
                    <Toolbar style={{ paddingLeft: 10 }} className={this.state.isSideOpened ? 'top-bar app-bar-shift' : 'top-bar'}>
                        {!this.state.isSideOpened && <IconButton edge='start' className={''} color='inherit' aria-label='menu' onClick={this.handleSideMenuOpen}>
                            <MenuIcon />
                        </IconButton>}
                        <Typography variant='h6' className={''} style={{ flexGrow: 1 }}>
                            {this.getHeaderName()}
                        </Typography>
                        <Menu
                            id={'user-menu'}
                            anchorEl={this.state.anchorUi}
                            open={this.state.isOpenMenu}
                            keepMounted
                            onClose={() => {
                                this.viewModel.set('isOpenMenu', false)
                                this.viewModel.set('anchorUi', null)
                            }}
                            PaperProps={{
                                style: {
                                    width: 240
                                }
                            }}
                        >
                        </Menu>
                    </Toolbar>
                </AppBar>


                <Drawer
                    className='drawer'
                    variant='persistent'
                    anchor='left'
                    open={this.state.isSideOpened}
                >

                    <div style={{ width: '100%', height: '100%' }}>
                        <div className='drawer-header' >
                            <img src={ImageAssets.ic_logo} alt='logo' style={{ height: 30, width: '75%', marginRight: 20 }} />
                            <IconButton onClick={() => { this.viewModel.set('isSideOpened', false) }}>
                                {this.state.isSideOpened ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <nav>
                            <div className='list-container'>
                                <ListItem
                                    className='list-item'
                                    activeClassName='list-item-active'
                                    component={NavLink}
                                    to={'/tenant'}
                                >
                                    <ListItemText style={{ alignItems: 'center' }} primary={'Tenants'}></ListItemText>
                                </ListItem>
                                <Divider />
                                <ListItem
                                    activeClassName='list-item-active'
                                    className='list-item'
                                    component={NavLink}
                                    to={'/admin'}
                                >
                                    <ListItemText style={{ alignItems: 'center' }} primary={'Admins'}></ListItemText>
                                </ListItem>
                                <Divider />
                                <div
                                    onClick={() => {
                                        this.viewModel.logout()
                                    }}
                                >
                                    <ListItem
                                        className='list-item'
                                    >
                                        <ListItemText style={{ alignItems: 'center' }} primary={'Logout'}></ListItemText>
                                    </ListItem>
                                </div>
                            </div>
                        </nav>
                        <Divider />
                    </div>
                </Drawer>
                <main className='main-home-component' style={{ marginTop: 70, marginLeft: this.state.isSideOpened ? 0 : -240, padding: 10 }}>
                    {this.props.children}
                </main>
            </div>
        )
    }

    getHeaderName = () => {
        const pathName = this.props.location && this.props.location.pathname ? this.props.location.pathname : '/tenant'
        switch (pathName) {
            case '/tenant': {
                return 'Tenants'
            }
            case '/admin': {
                return 'Admins'
            }
            case '/logout': {
                return 'Logout'
            }
            default: { return 'Tenants' }
        }
    }

    openMenu = (ev: any) => {
        this.viewModel.set('isOpenMenu', true)
        this.viewModel.set('anchorUi', ev.currentTarget)
    }

    closeMenu = () => {
        this.viewModel.set('isOpenMenu', false)
        this.viewModel.set('anchorUi', null)

    }

    _buildState() {
        return this.viewModel.getState()
    }
}
