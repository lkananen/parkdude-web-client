import React, { Component, ChangeEvent } from 'react';
import { AppState, Dispatch, IPerson } from '../../store/types';
import { connect } from 'react-redux';
import { modifyPerson, hidePersonsSnackBar, getPersons } from '../../store/actions/personsActions';
import Checkbox from '@material-ui/core/Checkbox';

import Spinner from './../Spinner/Spinner';
import './AcceptUsers.css';
import { SnackbarOrigin, Snackbar } from '@material-ui/core';

interface SelectedRows {
  [key: string]: boolean;
}

interface ReduxAcceptUserProps {
  getPersons: () => void;
  loading: boolean;
  persons: IPerson [];
  acceptPerson: (person: IPerson, type: string) => void;
  closeSnackBar: () => void;
  snackBarMessage: string;
}

type AcceptUserProps = {} & ReduxAcceptUserProps;

interface AcceptUserState {
  showAcceptModal: boolean;
  selectedRows: SelectedRows; 
}
class AcceptUsers extends Component<AcceptUserProps, AcceptUserState> {

  state = {
    selectedRows: {} as SelectedRows,
    showAcceptModal: false,
  };

  acceptPersons = () => {
    Object.keys(this.state.selectedRows).forEach(row => {
      if (this.state.selectedRows[row]) {

        const index = this.props.persons.findIndex( person => person.id === row);     
        this.props.acceptPerson(this.props.persons[index], 'accept-user');
      }
     
    });

  }

  handleCheckBoxClick = (event: ChangeEvent<HTMLInputElement>) => {
   
    const value: string = event.target.value;
    const oldvalue = this.state.selectedRows[value];
    const newSelectedRows = {...this.state.selectedRows};

    if (typeof oldvalue === "undefined") {
     
      newSelectedRows[value] = true;
      this.setState({selectedRows: newSelectedRows});
      
    } else {
     
      newSelectedRows[value] = !newSelectedRows[value];
      this.setState({selectedRows: newSelectedRows});

    }
  }

  componentDidMount() {
    this.props.getPersons();
  }

  render() {

    const header = 'Accept users';
    const acceptButton = <button id="table-view-accept-button" className="button" onClick={this.acceptPersons}>Accept selected</button>;

    const tableHeader = (
      <tr>
        <th>{}</th>
        <th>Name</th>
        <th>Email</th>
      </tr>
    );

    const content = this.props.persons.map((item) => {
      if ( item.role === 'unverified') {
        return (

          <tr key={item.id}>
            <td>
              <Checkbox
                onChange={this.handleCheckBoxClick}
                value={item.id}
                style={{ color: "#544C09"}}       
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />

            </td>
         
            <td>{item.name}</td>
            <td>{item.email}</td>
          </tr>

        );
      } else {return null; }
     
    });
    const snackLocation: SnackbarOrigin = {
      horizontal: 'center',
      vertical: 'bottom',
    };

    let page = (
      <div id="table-view">
              
        <div id="table-view-header-container" className="flex-row">
          <h2>{header} </h2>
          
        </div>

        <div className="table-container">
          <table id="table-view-table">

            <thead>
              {tableHeader}
            </thead>

            <tbody>
              {content}
            </tbody>
                                  
          </table>
        
        </div>

        <div id="table-view-delete-button-container" className="flex-row align-left-button-container">
          {acceptButton}
        </div> 
        <Snackbar 
          open={this.props.snackBarMessage !== ''}
          anchorOrigin={snackLocation}
          message={<span>{this.props.snackBarMessage}</span>}
          onClose={this.props.closeSnackBar}
          autoHideDuration={3000}
          
        />     
      
      </div>
      
    );

    if (this.props.loading) {
      page = <Spinner/>;
    }

    return (
  
      <>
      {page}
      </>
           
    );
  }
}

const mapState = (state: AppState) => {
  return {
    loading: state.persons.loading,
    persons: state.persons.personList,
    snackBarMessage: state.persons.snackBarMessage,
  };
};

const MapDispatch = (dispatch: Dispatch) => {
  return {
    acceptPerson: (person: IPerson, type: string) => dispatch(modifyPerson(person, type)),
    closeSnackBar: () => dispatch(hidePersonsSnackBar()),
    getPersons: () => dispatch(getPersons()),
  };
};
export default connect(mapState, MapDispatch)(AcceptUsers);
