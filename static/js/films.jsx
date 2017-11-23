const axios = require('axios');
const $ = require('jquery');
const _ = require('lodash');
import {Link, browserHistory} from 'react-router'
import React from 'react';
import ReactDOM from 'react-dom';
import {
    PageHeader,
    FormGroup,
    Form,
    Col,
    Checkbox,
    ControlLabel,
    FormControl,
    HelpBlock,
    Button,
    Label,
    Modal,
    Input,
    Table
} from 'react-bootstrap';
import NotificationSystem from 'react-notification-system';

export default class Films extends React.Component {
    constructor(props) {
        super(props);

        this.deleteFilm = this.deleteFilm.bind(this);
        this.addForUser = this.addForUser.bind(this);
        this.deleteForUser = this.deleteForUser.bind(this);
        this.open = this.open.bind(this);
    }

    componentDidMount() {
        const forUser = this.state && this.state.forUser ? 1 : 0;
        const filterQuery = this.state && this.state.filterQuery;
        const filterField = this.state && this.state.filterField;

        let opts = [];
        filterQuery && opts.push(`filterQuery=${filterQuery}`);
        filterField && opts.push(`filterField=${filterField}`);
        opts.push(`forUser=${forUser}`);
        const q = opts.join('&');

        return axios.get(`/get/films?${q}`).then((res) => {
            this.setState({ films: res && res.data });
        });
    }

    componentWillReceiveProps(props) {
        console.log(props);
        return this.setState({
            filterQuery: props && props.filterQuery,
            filterField: props && props.filterField,
            forUser: props && props.forUser
        }, () => this.componentDidMount());
    }

    open(id) {
        console.log(this.state.films);
        return () => {
            let res = {};
            _.forEach(this.state.films, (f) => {
                if (f.id == id) {
                    res = f;
                }
            });

            this.props.change(res);
            this.props.open();
        };
    }

    render() {
        const films = []
        let i = 1;
        const ids = [];

        if (this.state && this.state.films) {
            this.state.films.forEach((film) => {
                ids[i] = film.id;
                const href = `/reviews/${film.id}`;
                films.push((
                    <tr>
                        <td>{i}</td>
                        <td><img src={`${window.location.origin}${film.image}`} style={{width: '50px'}}/></td>
                        <td><Link to={href} style={{textDecoration: 'none'}}>{film.title} </Link> </td>
                        <td>{film.year}</td>
                        <td>{film.director}</td>
                        <td>{film.genre}</td>
                        {this.props.isAdmin && <td><Button bsStyle="info" data-filmId={film.id} onClick={this.open(film.id)}>EDIT</Button></td>}
                        {this.props.isAdmin && <td><Button bsStyle="danger" data-filmId={film.id} onClick={this.deleteFilm}>DELETE</Button></td>}
                        {!this.props.isAdmin && localStorage.getItem('user') && !film.added && <td><Button bsStyle="success" data-filmId={film.id} onClick={this.addForUser}>+</Button></td>}
                        {!this.props.isAdmin && localStorage.getItem('user') && film.added && <td><Button bsStyle="danger" data-filmId={film.id} onClick={this.deleteForUser}>-</Button></td>}
                    </tr>
                ))
                i++;
            });
        }

        return (
            <Table striped bordered condensed hover >
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Постер</th>
                        <th>Название</th>
                        <th>Год</th>
                        <th>Режиссер</th>
                        <th>Жанр</th>
                    </tr>
                </thead>
                <tbody>
                    {films}
                </tbody>
            </Table>
        );
    }

    addForUser(e) {
        e.preventDefault();
        const id = parseInt($(e.currentTarget).attr('data-filmId'));
        return axios.post(`/add/film/${id}`, {forUser: true}).then((res) => {
            return this.componentDidMount();
        });
    }

    deleteForUser(e) {
        e.preventDefault();
        const id = parseInt($(e.currentTarget).attr('data-filmId'));

        return axios.post(`/delete/film/${id}`, { forUser: true }).then((res) => {
            return this.componentDidMount();
        });
    }

    deleteFilm(e) {
        e.preventDefault();
        const id = parseInt($(e.currentTarget).attr('data-filmId'));

        return axios.post(`/delete/film/${id}`).then((res) => {
            return this.componentDidMount();
        });
    }
}
