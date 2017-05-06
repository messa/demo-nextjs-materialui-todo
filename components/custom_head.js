import Head from 'next/head'

export default () => (
  <Head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Todo app demo</title>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1"
    />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet"/>
    <style>{`
      html {
        font-family: 'Roboto', sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      body, h1, h2, h3, h4, h5, h6 {
        margin: 0;
      }
      body {
        font-size: 15px;
        line-height: 24px;
      }
    `}</style>
  </Head>
);
