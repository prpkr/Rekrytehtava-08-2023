import Link from "next/link";

export default function Nav() {
    return (
        
        <nav class="topnav" id="myTopnav">
            <Link href="/">Data-analytiikka</Link>
            <Link href="/users">Käyttäjät</Link>
            <Link href="/weighttrends">Painonmuutostilastot</Link>
            <Link href="javascript:void(0);" class="icon" onclick="toggleNav()">
                <i class="fa fa-bars"></i>
            </Link>
        </nav>
    );}