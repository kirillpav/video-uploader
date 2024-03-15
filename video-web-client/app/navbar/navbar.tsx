import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function Navbar() {
	// init user state
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		const unsubscribe = onAuthStateChangedHelper((user) => {
			setUser(user);
		});

		return () => unsubscribe();
	});

	return (
		<nav className={styles.nav}>
			<Link className={styles.logoCotainer} href="/">
				<Image
					width={90}
					height={20}
					className={styles.logo}
					src="/video-icon.svg"
					alt="logo"
				/>
			</Link>
			<SignIn />
		</nav>
	);
}
