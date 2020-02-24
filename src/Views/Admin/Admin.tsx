import React from 'react'
import { HomeComponent } from '../HomeComponent/HomeComponent'
import { IAdminState, AdminViewModel } from '../../ViewModels/AdminViewModel'
import { ComponentBase } from 'resub'
import PageLoader from '../../Components/Loader/PageLoader'
import { Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, MenuItem, Select, TextField, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@material-ui/core/'
import { DependencyInjector } from '../../DependencyInjector/DependencyInjector'
import SearchIcon from '@material-ui/icons/Search'
import SnackbarComponent from '../../Components/SnackBarComponent'
import { EmptyView } from '../../Components/EmptyView/EmptyView'
import './Admin.style.css'

export default class Admin extends ComponentBase<any, IAdminState> {
    viewModel: AdminViewModel
    constructor(props: any) {
        super(props)
        this.viewModel = DependencyInjector.default().provideAdminViewModel()
    }

    componentDidMount() {
        this.viewModel.load()
    }

    render() {
        return (
            <HomeComponent {...this.props}>
                {this.state.isLoading && <PageLoader></PageLoader>}

                {this.state.response &&
                    <SnackbarComponent
                        className={'snackbar-success'}
                        message={this.state.response && this.state.response.message}
                        vertical={'bottom'}
                        horizontal={'center'}
                        open={this.state.response ? true : false}
                        onClose={() => {
                            this.viewModel.set('response', false)
                        }}
                    />
                }

                {this.state.error &&
                    <SnackbarComponent
                        className={'snackbar-error'}
                        message={this.state.error && this.state.error.message}
                        vertical={'bottom'}
                        horizontal={'center'}
                        open={this.state.error ? true : false}
                        onClose={() => {
                            this.viewModel.set('error', false)
                        }}
                    />
                }

                {this.state.admins && this.state.admins.length ?
                    < div >
                        <Paper style={{ width: '100%', boxShadow: '0 4px 10px rgba(0,0,0,.6)' }}>
                            <div style={{ margin: '10px', borderRadius: '5px', maxHeight: '440px', overflowY: 'auto' }}>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }} >
                                    <div >
                                        <TextField
                                            variant='standard'
                                            label='Search...'
                                            className='admin-search-holder'
                                            onChange={(ev) => { }}
                                            onFocus={(event) => {

                                            }}
                                            onInput={(event: any) => {
                                                event.target.value = event.target.value.slice(0, 30)
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position='end'>
                                                    <IconButton
                                                        onClick={() => {

                                                        }}
                                                    >
                                                        < SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            }}
                                        />
                                    </div>

                                    <div style={{ height: 40 }}>
                                        <Select
                                            id='demo-customized-select-native'
                                            value={this.state.filterData}
                                            onChange={(event) => { this.viewModel.set('filterData', event.target.value) }}
                                            className='admin-filter-by-data'
                                        >
                                            <MenuItem value='None'>None</MenuItem>
                                            <MenuItem value='Name'>Name</MenuItem>
                                            <MenuItem value='OrganizationName'>Organization Name</MenuItem>
                                            <MenuItem value='Email'>Email</MenuItem>
                                            <MenuItem value='PhoneNumber'>Phone Number</MenuItem>
                                        </Select>
                                    </div>

                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            this.viewModel.set('openAdminInviteForm', true)
                                        }}
                                        style={{ backgroundColor: '#fd8f78', color: '#ffffff' }}
                                    >
                                        Invite Admin
                                    </Button>
                                    {this._renderAdminInvite()}

                                </div>
                                <Table stickyHeader aria-label='sticky table'>
                                    <TableHead>
                                        <TableRow>
                                        </TableRow>
                                    </TableHead>
                                    <TableHead className='admin-row-header'>
                                        <TableRow>
                                            {this.viewModel.getTableColumnList().map((column: any) => (
                                                <TableCell
                                                    key={`${column.id}-${column.name}`}
                                                >
                                                    <span className='column-header-table-listing'>{column.name}</span>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.admins.map((row: any, rowIndex: any) => {
                                                return (
                                                    <TableRow hover role='checkbox' tabIndex={-1} key={`${rowIndex}-${row.name}`}>
                                                        {this.viewModel.getTableColumnList().map((column: any, index: any) => {
                                                            const value = row[column.id]
                                                            if (column.id === 'status') {
                                                                return < TableCell key={`${row.id}` + index} className='listing-common-style-header' >
                                                                    <button
                                                                        disabled={true}
                                                                        style={{ height: 25, backgroundColor: '#fd8f78', border: 0, boxShadow: '0 0 0 0', borderRadius: 10 }}
                                                                    >
                                                                        <label style={{ color: '#fff', cursor: 'inherit' }}>{value}</label>
                                                                    </button>
                                                                </TableCell>
                                                            } else {
                                                                return < TableCell key={`${row.id}` + index} className='listing-common-style-header' >
                                                                    {value}
                                                                </TableCell>
                                                            }
                                                        })}
                                                    </TableRow>
                                                )
                                            })
                                        }

                                    </TableBody>
                                </Table>
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[2, 5, 10]}
                                component='div'
                                count={this.state.totalCount}
                                rowsPerPage={this.state.pageSize}
                                page={this.state.pageIndex}
                                onChangePage={(event: any, index) => {
                                    this.viewModel.set('pageIndex', index)
                                    this.viewModel.load()
                                }}
                                onChangeRowsPerPage={(event: any) => {
                                    this.viewModel.set('pageSize', event.target.value)
                                    this.viewModel.load()
                                }
                                }
                            />
                        </Paper >
                    </div >
                    : <EmptyView />}
            </HomeComponent >
        )
    }

    _renderAdminInvite() {
        return (
            <Dialog aria-labelledby='form-dialog-title' open={this.state.openAdminInviteForm} onClose={() => { this.viewModel.set('openAdminInviteForm', false) }}>

                <DialogTitle style={{ display: 'flex', justifyContent: 'center' }} >
                    Invite Admin
                </DialogTitle>
                <DialogContent>
                    <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.adminNameError && this.state.adminNameError.message}</span>
                        </div>
                        <TextField
                            variant='outlined'
                            label='Name'
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => { this.viewModel.set('adminName', ev.target.value) }}
                            onFocus={(event) => {
                                this.viewModel.set('adminNameError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 30)
                            }}
                        />

                        <TextField
                            variant='outlined'
                            label='Email'
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => { this.viewModel.set('adminEmail', ev.target.value) }}
                            onFocus={(event) => {
                                this.viewModel.set('adminEmailError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 30)
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.adminEmailError && this.state.adminEmailError.message}</span>
                        </div>

                        <TextField
                            variant='outlined'
                            label='Phone Number'
                            type='number'
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => { this.viewModel.set('adminPhoneNumber', ev.target.value) }}
                            onFocus={(event) => {
                                this.viewModel.set('adminPhoneNumberError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 10)
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.adminPhoneNumberError && this.state.adminPhoneNumberError.message}</span>
                        </div>

                    </div>
                </DialogContent>
                <div style={{ alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                    <Button
                        variant={'outlined'}
                        onClick={() => {
                            this.viewModel.inviteAdmin()
                        }}
                        style={{ backgroundColor: '#fd8f78', color: '#ffffff' }}
                    >
                        Invite
                    </Button>
                </div>
            </Dialog >

        )
    }
    _buildState() {
        return this.viewModel.getState()
    }
}
