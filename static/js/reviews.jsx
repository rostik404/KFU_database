const axios = require('axios');
const $ = require('jquery');
const _ = require('lodash');
import React from 'react';
import ReactDOM from 'react-dom';
import {
    Grid,
    Row,
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
import {browserHistory} from 'react-router';
import NotificationSystem from 'react-notification-system';

export default class Reviews extends React.Component {
    constructor(props) {
        super(props);

        this.submitReview = this.submitReview.bind(this);
    }

    componentDidMount() {
        return Promise.all([
            axios.get(`/get/film?id=${this.props.params.filmId}`),
            axios.get(`/get/reviews?filmId=${this.props.params.filmId}`)
        ]).then((res) => {
            this.setState({film: res[0] && res[0].data});
            this.setState({reviews: res[1] && res[1].data});
            console.log(this.state.reviews);
        });
    }

    componentWillReceiveProps(props) {
        this.componentDidMount();
    }

    submitReview(event) {
        event.preventDefault();

        const config = {
            headers: {'content-type': 'multipart/form-data'}
        }

        const fd = new FormData();
        fd.append('filmId', this.state.film.id);
        fd.append('content', ReactDOM.findDOMNode(this.refs['reviewContent']).value)
        ReactDOM.findDOMNode(this.refs['reviewContent']).value = '';
        return axios.post('/add/review', fd).then(() => this.componentDidMount());
    }

    render() {
        const reviews = this.state && this.state.reviews && this.state.reviews.map((r) => {
            return <div>
                <b>{r.user}</b>
                <div>{r.content}</div>
            </div>
        });
        let film = '';
        if (this.state && this.state.film) {
            film =
            <Grid>
                <Row className="show-grid" sm={8}>
                    <Col sm={3}><img src={`${window.location.origin}${this.state.film.image}`} style={{width: '250px'}} /></Col>
                    <Col sm={5}>
                        <h3>{this.state.film.title}</h3>
                        <Table responsive>
                            <tbody>
                                <tr>
                                    <td>Режиссер</td>
                                    <td>{this.state.film.director}</td>
                                </tr>
                                <tr>
                                    <td>Жанр</td>
                                    <td>{this.state.film.genre}</td>
                                </tr>
                                <tr>
                                    <td>Год</td>
                                    <td>{this.state.film.year}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col sm={4}>
                        <h4>Отзывы</h4>
                        {reviews}
                    </Col>
                </Row>
            </Grid>
        };

        let rwForm =
        <Grid >
            <Col sm={8}>
            <Form horizontal method='POST' onSubmit={this.submitReview} ref='form'>
                <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>Оставить отзыв</ControlLabel>
                    <FormControl ref="reviewContent" componentClass="textarea" placeholder="Напишите ваш отзыв" />
                </FormGroup>

                <Button type="submit">
                    Отправить
                </Button>
            </Form>
            </Col>
        </Grid>

        return(
        <div>
            <div>
            {film}
            </div>
            <div>
                {rwForm}
            </div>
        </div>
        )
    }
}
