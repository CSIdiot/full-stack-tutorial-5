const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

class DisplayFreeSlots extends React.Component {
  constructor() {
    super();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "show_space_left"
    }, "Space left: ", (25 - this.props.size).toString());
  }

}

class DisplayCustomers extends React.Component {
  constructor() {
    super();
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "show_waitlist_table"
    }, /*#__PURE__*/React.createElement("h2", null, "Waitlist Table"), /*#__PURE__*/React.createElement("table", {
      className: "waitlist_table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "Name"), /*#__PURE__*/React.createElement("th", null, "Mobile"), /*#__PURE__*/React.createElement("th", null, "Created"))), /*#__PURE__*/React.createElement("tbody", {
      className: "waitlist_table_content"
    }, this.props.customers.map(customer => {
      return /*#__PURE__*/React.createElement("tr", {
        key: customer.id
      }, /*#__PURE__*/React.createElement("td", null, customer.id), /*#__PURE__*/React.createElement("td", null, customer.name), /*#__PURE__*/React.createElement("td", null, customer.mobile), /*#__PURE__*/React.createElement("td", null, customer.created.toDateString()));
    }))));
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
      return alert("No empty space!");
    }

    ;
    const form = document.forms.customerAdd;
    const customer = {
      name: form.name.value,
      mobile: form.mobile.value
    };
    this.props.createCustomer(customer);
    form.name.value = "";
    form.mobile.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "add_form"
    }, /*#__PURE__*/React.createElement("form", {
      name: "customerAdd",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "mobile",
      placeholder: "Mobile"
    }), /*#__PURE__*/React.createElement("button", {
      className: "buttons",
      id: "btnA"
    }, "Add")));
  }

}

class DeleteCustomer extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.customerDelete;
    const customer = {
      name: form.name.value,
      mobile: form.mobile.value
    };
    this.props.deleteCustomer(customer);
    form.name.value = "";
    form.mobile.value = "";
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "del_form"
    }, /*#__PURE__*/React.createElement("form", {
      name: "customerDelete",
      onSubmit: this.handleSubmit
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "name",
      placeholder: "Name"
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      name: "mobile",
      placeholder: "Mobile"
    }), /*#__PURE__*/React.createElement("button", {
      className: "buttons",
      id: "btnD"
    }, "Delete")));
  }

}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
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
    this.state = {
      customers: []
    };
    this.createCustomer = this.createCustomer.bind(this);
    this.deleteCustomer = this.deleteCustomer.bind(this);
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
      this.setState({
        customers: data.waitList
      });
    }
  }

  async createCustomer(customer) {
    const query = `mutation AddCustomer($customer: customerInputs!) {
            AddCustomer(customer: $customer)
        }`;
    const data = await graphQLFetch(query, {
      customer
    });

    if (data) {
      this.loadData();
    }

    alert("Successfully added!");
  }

  async deleteCustomer(customer) {
    const query = `mutation deleteCustomer($customer: customerInputs!) {
            deleteCustomer(customer: $customer)
        }`;
    const data = await graphQLFetch(query, {
      customer
    });

    if (data) {
      this.loadData();
    }

    alert("Successfully deleted!");
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "head"
    }, "Hotel Waitlist System"), /*#__PURE__*/React.createElement("div", {
      id: "wrapper"
    }, /*#__PURE__*/React.createElement(DisplayFreeSlots, {
      size: this.state.customers.length
    }), /*#__PURE__*/React.createElement(AddCustomer, {
      createCustomer: this.createCustomer
    }), /*#__PURE__*/React.createElement(DeleteCustomer, {
      customers: this.state.customers,
      deleteCustomer: this.deleteCustomer
    }), /*#__PURE__*/React.createElement(DisplayCustomers, {
      customers: this.state.customers
    })));
  }

}

const element = /*#__PURE__*/React.createElement(Wrapper, null);
ReactDOM.render(element, document.getElementById('contents'));