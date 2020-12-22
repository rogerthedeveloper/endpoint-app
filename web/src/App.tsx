import logo from './logo.svg';
import './App.css';
import { Button, Container, Card, CardContent, Grid, TextField, FormControl } from '@material-ui/core';
import React, { FormEvent } from 'react';


class App extends React.Component { 

  state: any = {
      isLoading: false,
      items: [],
  };

  constructor(props: {} | Readonly<{}>) {

    super(props);
    this.state = {
      isLoading: false,
      items: []
    };

    this.search = this.search.bind(this);

  }
  
  search = (event: FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    let myHeaders = new Headers();

    let term = (event.currentTarget.elements[0] as HTMLInputElement).value

    let myInit: RequestInit = { 
      method: 'GET',
      headers: myHeaders
    };

    var myRequest = new Request(`/api?search=${term}`, myInit);

    fetch(myRequest)
    .then(resp => resp.json())
    .then(result => {

      this.setState({
        isLoaded: true,
        items: result
      });

    });

  }
  render() {

  let order = this.state.items;

  return (
      <div className="App">
        <br/>
        <br/>
        <footer className="App-header">
          <Container maxWidth="sm">
            <Card>
              <CardContent>

              <form onSubmit={this.search}>

                <Grid container justify="center" spacing={3}>
                <Grid item md={6}>
                <FormControl fullWidth variant="outlined">
                  <TextField name="search" required variant="outlined"/>
                  </FormControl>
                </Grid>
                <Grid item md={6}>
                <FormControl fullWidth variant="outlined">
                  <Button style={{minHeight: "4em"}} type="submit" color="primary" variant="contained">Buscar</Button>
                  </FormControl>
                </Grid>
                </Grid>
              </form>

              </CardContent>
            </Card>

            <br/>

            {
            
              order.map((item: any, i: string) => {
                return (
                  <Card style={{marginBottom: 12}} key={i}>
                    <CardContent>
                    <Grid container justify="center" spacing={3}>
                      <Grid item md={11}>
                        {item.name}
                      </Grid>
                      <Grid item md={1}>
                        <img style={{ maxWidth: "100%"}} src={`${item.source}.png`} title={`Resultado desde: ${item.source}`} alt={`Resultado desde: ${item.resource}`} />
                      </Grid>
                    </Grid>
                    </CardContent>
                  </Card>
                )
              })
              
            }

            <div className="logoSection">
              <img src={logo} className="App-logo" alt="logo" />
            </div>

          </Container>
        </footer>
      </div>
  );

  }

}

export default App;
