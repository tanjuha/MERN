import React, { useState, useEffect, useContext } from 'react';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';

export const AuthPage = () => {

   const auth = useContext(AuthContext)

  const message = useMessage()

  const {loading, request, error, clearError } = useHttp();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.updateTextFields()
  }, []);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value})
  }

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form});
      message(data.message);
    } catch(e) {}
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form});
     // message(data.message);
      auth.login(data.token, data.userId)
    } catch(e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Cut link</h1>
        <div className="card blue-grey darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div>
              <div className="input-field">
                <input
                  id="email"
                  type="text"
                  className="validate color-input"
                  name="email"
                  value={form.email}
                  onChange = {changeHandler}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input
                  id="password"
                  type="password"
                  className="color-input"
                  name="password"
                  value={form.password}
                  onChange = {changeHandler}
                />
                <label htmlFor="password">password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button 
            className="btn waves-effect waves-light"
            onClick={loginHandler}
            disabled={loading}
            >Enter</button>
            <button
              className="btn waves-effect light-blue darken-4"
              onClick={registerHandler}
              disabled={loading}
              >
              Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
