import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider, makeStyles } from '@material-ui/core/styles'
import { theme, Web3Provider, PageTemplate } from '@rsksmart/rif-ui'
import { AppStoreProvider } from 'store/App/AppStore'
import { MarketStoreProvider } from 'store/Market/MarketStore'
import Footer from 'components/organisms/Footer'
import Header from 'components/organisms/Header'
import Routes from 'components/Routes'
import '@rsksmart/rif-ui/dist/index.css'

const useStyles = makeStyles(() => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
}))

const App = () => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <AppStoreProvider>
        <MarketStoreProvider>
          <Web3Provider.Provider>
            <Router>
              <div className={classes.router}>
                <Header />
                <PageTemplate>
                  <Routes />
                </PageTemplate>
                <Footer />
              </div>
            </Router>
          </Web3Provider.Provider>
        </MarketStoreProvider>
      </AppStoreProvider>
    </ThemeProvider>
  )
}

export default App
