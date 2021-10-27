const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}


class DisplayFreeSlots extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="show_space_left">Space left: {(25 - this.props.size).toString()}</div>
        );
    }
}


class DisplayCustomers extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <div className="show_waitlist_table">  
                <h2>Waitlist Table</h2>
                <table className="waitlist_table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody className="waitlist_table_content">
                        {this.props.customers.map(customer => {
                            return (
                                <tr key={customer.id}>
                                    <td>{customer.id}</td>
                                    <td>{customer.name}</td>
                                    <td>{customer.mobile}</td>
                                    <td>{customer.created.toDateString()}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>  
            </div>
        );
    }
}


class AddCustomer extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.size >= 25) {
            return alert("No empty space!")
        };
        const form = document.forms.customerAdd;
        const customer = {
            name: form.name.value, mobile: form.mobile.value
        };
        this.props.createCustomer(customer);
        form.name.value = ""; form.mobile.value = "";
      }

    render() {
        return (
            <div className="add_form">
                <form name="customerAdd" onSubmit={this.handleSubmit}>
                    <input type="text" name="name" placeholder="Name" />
                    <input type="text" name="mobile" placeholder="Mobile" />
                    <button className="buttons" id="btnA">Add</button>
                </form>
            </div>
        );
    }
}


class DeleteCustomer extends React.Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.customerDelete;
        const customer = {
            name: form.name.value, mobile: form.mobile.value
        };
        this.props.deleteCustomer(customer);
        form.name.value = ""; form.mobile.value = "";
      }

    render() {
        return (
            <div className="del_form">
                <form name="customerDelete" onSubmit={this.handleSubmit}>
                    <input type="text" name="name" placeholder="Name"  />
                    <input type="text" name="mobile" placeholder="Mobile" />
                    <button className="buttons" id="btnD">Delete</button>
                </form>
            </div>
        )
    }
}


async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }


class Wrapper extends React.Component {
    constructor() {
        super();
        this.state = { customers: [] };
        this.createCustomer = this.createCustomer.bind(this)
        this.deleteCustomer = this.deleteCustomer.bind(this)
    }

    componentDidMount() {
        this.loadData();
    }
    

    async loadData() {
        const query = `query {
            waitList {
              id name mobile created
            }
          }`;


        const data = await graphQLFetch(query);
        if (data) {
          this.setState({ customers: data.waitList });
        }
    }


    async createCustomer(customer) {
        const query = `mutation AddCustomer($customer: customerInputs!) {
            AddCustomer(customer: $customer)
        }`;

        const data = await graphQLFetch(query, { customer });
        if (data) {
          this.loadData();
        }
        alert("Successfully added!");
    }


    async deleteCustomer(customer) {
        const query = `mutation deleteCustomer($customer: customerInputs!) {
            deleteCustomer(customer: $customer)
        }`;

        const data = await graphQLFetch(query, { customer });
        if (data) {
          this.loadData();
        }
        alert("Successfully deleted!")
    }


    render() {
        return (
            <React.Fragment>

                <div className="head">Hotel Waitlist System</div>
                <div id="wrapper">
                    <DisplayFreeSlots size={this.state.customers.length} />
                    
                    <AddCustomer customers={this.state.customers} createCustomer={this.createCustomer} />
                    
                    <DeleteCustomer customers={this.state.customers} deleteCustomer={this.deleteCustomer} />

                    <DisplayCustomers customers={this.state.customers} />
                </div>

            </React.Fragment>
        )
    }
}

const element = <Wrapper />;

ReactDOM.render(element, document.getElementById('contents'));