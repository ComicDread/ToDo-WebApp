import App from './App'
import './index.css'
import {InMemoryCache, ApolloProvider, ApolloClient} from '@apollo/client';
import { createRoot } from 'react-dom/client';
import {createBrowserRouter,RouterProvider,Route} from "react-router-dom"
import Login from './pages/Login'
import Register from './pages/Register'
import Error from './pages/Error'

const client = new ApolloClient({
  uri: 'http://localhost:5555/graphql',
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));

const router = createBrowserRouter([
  {
    path:'Login',
    element: <Login/>
  }, 
  {
    path:'Register',
    element: <Register/>
  },
  {
    path:'Error',
    element: <Error/>
  },
  {
      path:'/',
      element:<App/>
  }   
])

root.render(
<ApolloProvider client={client}>
  <RouterProvider router={router}/>
</ApolloProvider>
);

export default client
