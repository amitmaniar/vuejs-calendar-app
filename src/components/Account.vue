<template>
<div id="app" class="container">
  <div class="row">
    <div class="col-sm">
      <div class="card">
        <div class="card-body">
          <h4 class="text-center">Signup</h4>
      <form @submit.prevent="doSignup" class="mb-3">
      <div v-if="signup_error" class="alert alert-warning">
        <p class="mb-0">{{signup_error}}</p>
      </div>
      <div v-if="signup_success" class="alert alert-success">
        <p class="mb-0">{{signup_success}}</p>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="signup.username"
          type="text"
          class="form-control"
          id="email"
          placeholder="Enter email"
          required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="signup.password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Signup</button>
    </form>
  </div>
    </div>
    </div>
    <div class="col-sm">
      <div class="card">
        <div class="card-body">
         <h4 class="text-center">Login</h4>
      <form @submit.prevent="doLogin" class="mb-3">
      <div v-if="login_error" class="alert alert-warning">
        <p class="mb-0">{{login_error}}</p>
      </div>
      <div v-if="login_success" class="alert alert-success">
        <p class="mb-0" v-html="login_success"></p>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="login.username"
          type="text"
          class="form-control"
          id="email"
          placeholder="Enter email"
          required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="login.password"
          type="password"
          class="form-control"
          id="password"
          placeholder="Enter password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
    </div>
  </div>
    </div>
  </div>
</div>
</template>

<script>
import CONSTANTS from '../constant';

export default {
  name: 'account',
  data: () => ({
    signup_error: '',
    signup_success: '',
    login_error: '',
    login_success: '',
    signup: {
      username: '',
      password: '',
    },
    login: {
      username: '',
      password: '',
    },
  }),
  methods: {
    doSignup() {
      fetch(CONSTANTS.API_URL.concat('signup'), {
        method: 'POST',
        body: JSON.stringify(this.signup),
        headers: {
          'content-type': 'application/json',
        },
      }).then(response => response.json())
        .then((result) => {
          if (result.status === 'error') {
            this.signup_error = result.msg;
          } else {
            this.signup_success = 'Signup successful. Please login to continue.';
          }
        });
    },
    doLogin() {
      fetch(CONSTANTS.API_URL.concat('login'), {
        method: 'POST',
        body: JSON.stringify(this.login),
        headers: {
          'content-type': 'application/json',
        },
      }).then(response => response.json())
        .then((result) => {
          if (result.status === 'error') {
            this.login_error = result.msg;
          } else {
            localStorage.token = result.msg;
            window.location.href = '/';
          }
        });
    },
  },
};
</script>

<style>
img {
  max-width: 300px;
  height: auto;
}
</style>
