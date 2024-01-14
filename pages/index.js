import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";

export default function Home() {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section id="data">
                <h1>Data-analytiikka alusta</h1>
                <hr/>
                <div>
            Tervetuloa Onnikan data-analytiikka alustalle. Tämä alusta on suunniteltu Suohenmaan hyvinvointialueen (Suoha) ammattilaisille. Täällä voit seurata reaaliaikaista tietoa Onnikan käyttöön liittyen data-visualisointien avulla. 
                </div>

                <div class="wrap">
                    <div class="dataCard">Käyttäjiä:
                        <p id="currentUsers" class="strong"></p>
            kappaletta
                    </div>
                    <div class="dataCard">Keskimäärin:
                        <p id="avgWeightChange" class="strong"></p>
            kg/kk
                    </div>
                    <div class="dataCard">Yhteensä:
                        <p id="totalWeightLoss" class="strong"></p>
            kg
                    </div>
                </div>
            </section>
        </Layout>
    );
}
