import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MarketStoreProvider } from 'store/Market/MarketStore';
import Web3Provider from 'rifui/providers/Web3Provider';
import { ThemeProvider, Theme, makeStyles } from '@material-ui/core/styles';
import { theme } from 'rifui/theme';
import Footer from 'components/organisms/Footer';
import Header from 'components/organisms/Header';
import Routes from 'components/Routes';

// TODO: Remove this once connected to cache
import { MarketListingType } from 'models/Market';
import LocalStorage from 'utils/LocalStorage';
import { domainListing } from 'data/domains';
const persistence = LocalStorage.getInstance();
// End of the block to be removed

persistence.setItem(MarketListingType.domainListing, domainListing);

const useStyles = makeStyles((theme: Theme) => ({
  router: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }
}));

const App = () => {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <MarketStoreProvider>
        <Web3Provider.Provider>
          <Router>
            <div className={classes.router}>
              <Header />
              <Routes />
              <Footer />
            </div>
          </Router>
        </Web3Provider.Provider>
      </MarketStoreProvider>
    </ThemeProvider>
  );
};

export default App;