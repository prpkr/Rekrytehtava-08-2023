import Head from "next/head";
import Layout from "../components/layout";

export default function WeightTrends() {
    return (
        <Layout>
            <Head>
                <title>Käyttäjien painonmuutostilastot</title>
            </Head>
            <section id="weight-trend">
                <h2>Käyttäjien painonmuutostilastot</h2>
                <hr/>
                <div>
          Tässä näet tilastot käyttäjien painonmuutoksesta.
                </div>
                <div class="chart">
                    <div id="weight_chart"></div>
                    <div id="chart-controls">
                        <form id="chartForm" class="chartForm">
                            <label>
                                <input type="checkbox" id="averageChangeCheckbox" checked/>
                  Keskimääräinen muutos
                            </label>
                            <label>
                                <input type="checkbox" id="medianChangeCheckbox" checked/>
                  Mediaani muutos
                            </label>
                            <label>
                                <input type="checkbox" id="countCheckbox" checked/>
                  Käyttäjien määrä
                            </label>
                            <label>
                                <input type="checkbox" id="standardDeviationCheckbox" checked/>
                  Keskihajonta
                            </label>
                        </form>
                        <button type="button" onclick="updateChartClick()">Päivitä</button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
