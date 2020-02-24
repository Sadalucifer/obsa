import React from 'react'
import { Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Select, MenuItem, DialogTitle, Dialog, DialogContent, TextField, Button, InputAdornment, IconButton } from '@material-ui/core/'
import { HomeComponent } from '../HomeComponent/HomeComponent'
import { ComponentBase } from 'resub'
import { TenantViewmodel, ITenantState } from '../../ViewModels/TenantViewModel'
import { DependencyInjector } from '../../DependencyInjector/DependencyInjector'
import PageLoader from '../../Components/Loader/PageLoader'
import { EmptyView } from '../../Components/EmptyView/EmptyView'
import SearchIcon from '@material-ui/icons/Search'
import SnackbarComponent from '../../Components/SnackBarComponent'
import './Tenant.style.css'

export class Tenant extends ComponentBase<any, ITenantState> {

    viewModel: TenantViewmodel
    constructor(props: any) {
        super(props)
        this.viewModel = DependencyInjector.default().provideTenantViewModel()
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

                {this.state.tenants && this.state.tenants.length ?
                    <Paper style={{ width: '100%', boxShadow: '0 4px 10px rgba(0, 0, 0, .6)' }}>
                        <div style={{ margin: '10px', borderRadius: '5px', maxHeight: '440px', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }} >
                                <div >
                                    <TextField
                                        className='tenant-search-holder'
                                        variant='standard'
                                        label='Search....'
                                        onChange={(event) => {
                                            this.viewModel.set('searchData', event.target.value)
                                        }}
                                        onInput={(event: any) => {
                                            event.target.value = event.target.value.slice(0, 30)
                                        }}
                                        InputProps={{
                                            endAdornment: <InputAdornment position='end'>
                                                <IconButton
                                                    onClick={() => {
                                                        this.viewModel.load()
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
                                        className='tenant-filter-by-data'
                                        value={this.state.filterData}
                                        onChange={(event) => { this.viewModel.set('filterData', event.target.value) }}
                                    >
                                        <MenuItem value='None'>None</MenuItem>
                                        <MenuItem value='Name'>Name</MenuItem>
                                        <MenuItem value='OrganizationName'>Organization Name</MenuItem>
                                        <MenuItem value='Email'>Email</MenuItem>
                                        <MenuItem value='PhoneNumber'>Phone Number</MenuItem>
                                    </Select>
                                </div>
                                {this._renderInvite()}
                                <div>

                                    <Button
                                        variant='contained'
                                        onClick={() => {
                                            this.viewModel.set('openInviteTenantForm', true)
                                        }}
                                        style={{ backgroundColor: '#fd8f78', color: '#ffffff' }}
                                    >
                                        Invite Tenant
                                    </Button>
                                </div>
                            </div>
                            <Table stickyHeader aria-label='sticky table'>
                                <TableHead>
                                    <TableRow>
                                    </TableRow>
                                </TableHead>
                                <TableHead className='tenant-table-row-holder'>
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
                                <TableBody className='tenant-table-row-holder'>
                                    {
                                        this.state.tenants && this.state.tenants.map((row: any, rowIndex: any) => {
                                            return (
                                                <TableRow hover role='checkbox' tabIndex={-1} key={`${rowIndex}-${row.name}`}>
                                                    {this.viewModel.getTableColumnList().map((column: any, index: any) => {
                                                        const value = row[column.id]
                                                        return < TableCell key={`${row.id}` + index} className='listing-common-style-header' >
                                                            {value}
                                                        </TableCell>
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
                            }}
                        />
                    </Paper>
                    : <EmptyView />
                }
            </HomeComponent>
        )
    }

    _renderInvite() {
        return (
            <Dialog aria-labelledby='form-dialog-title' open={this.state.openInviteTenantForm} onClose={() => { this.viewModel.set('openInviteTenantForm', false) }}>

                <DialogTitle style={{ display: 'flex', justifyContent: 'center' }}>
                    Invite Tenant
                </DialogTitle>
                <DialogContent>
                    <div style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.tenantOrganizationNameError && this.state.tenantOrganizationNameError.message}</span>
                        </div>
                        <TextField
                            variant='outlined'
                            label='Organization Name'
                            required={true}
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => {
                                this.viewModel.set('tenantOrganizationName', ev.target.value)
                            }}
                            onFocus={(event) => {
                                this.viewModel.set('tenantOrganizationNameError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 30)
                            }}
                        />

                        <TextField
                            variant='outlined'
                            label='Email'
                            required={true}
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => {
                                this.viewModel.set('tenantEmail', ev.target.value)
                            }}
                            onFocus={(event) => {
                                this.viewModel.set('tenantEmailError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 30)
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.tenantEmailError && this.state.tenantEmailError.message}</span>
                        </div>

                        <TextField
                            variant='outlined'
                            label='Account Owner Name'
                            required={true}
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => {
                                this.viewModel.set('tenantAccountOwnerName', ev.target.value)
                            }}
                            onFocus={(event) => {
                                event.target.value = event.target.value.slice(0, 10)
                                this.viewModel.set('tenantAccountOwnerNameError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 10)
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.tenantAccountOwnerNameError && this.state.tenantAccountOwnerNameError.message}</span>
                        </div>

                        <TextField
                            variant='outlined'
                            label='PhoneNumber'
                            type='number'
                            style={{ width: '100%', marginTop: 20 }}
                            onChange={(ev) => {
                                this.viewModel.set('tenantPhoneNumber', ev.target.value)
                            }}
                            onFocus={(event) => {
                                this.viewModel.set('tenantPhoneNumberError', undefined)
                            }}
                            onInput={(event: any) => {
                                event.target.value = event.target.value.slice(0, 10)
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <span style={{ color: 'red' }}>{this.state.tenantPhoneNumberError && this.state.tenantPhoneNumberError.message}</span>
                        </div>

                    </div>
                </DialogContent>
                <div style={{ alignItems: 'center', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 5 }}>
                    <Button
                        variant={'outlined'}
                        onClick={() => {
                            this.viewModel.inviteTenant()
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
