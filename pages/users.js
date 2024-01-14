import Head from "next/head";
import Layout from "../components/layout";

export default function Users() {
    return (
        <Layout>
            <Head>
                <title>Käyttäjämäärät</title>
            </Head>
            <section id="users" class="grey">
                <h2>Käyttäjämäärät</h2>
                <hr/>
                <div>
          Tällä osiolla voit tarkastella sivuston käyttäjämäärien kehitystä.
                </div>
                <div class="chart">
                    <div id="users_chart"></div>
                    <button id="usersModalBtn">Avaa taulukossa</button>
                </div>
            </section>  
        </Layout>
    );
}
