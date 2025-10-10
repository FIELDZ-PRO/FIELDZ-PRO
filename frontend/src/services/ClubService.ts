
const UrlService = "http://localhost:8080/api";


type LoginResponse = {
    token: string;
};

async function Login(email: string, motDePasse: string): Promise<LoginResponse> {
    try {
        const res = await fetch(`${UrlService}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
            },
            body: JSON.stringify({ email, motDePasse }),
        });

        if (!res.ok) {
            throw new Error(`Login failed with status ${res.status}`);
        }

        const data: LoginResponse = await res.json();
        localStorage.setItem("token", data.token)
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error; // re-throw so the component can handle it
    }
}

async function AjouterUnTerrain(nomTerrain: String, typeSurface: String, ville: String, sport: String) {
    try {
        const token = localStorage.getItem("token")
        const res = await fetch(`${UrlService}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Bearer": `${token}`
            },
            body: JSON.stringify({ nomTerrain, typeSurface, ville, sport }),
        });

        if (!res.ok) {
            throw new Error(`Login failed with status ${res.status}`);
        }

        const data: LoginResponse = await res.json();
        //localStorage.setItem("token", data.token)
        return data;
    } catch (error) {
        console.error("Login error:", error);
        throw error; // re-throw so the component can handle it
    }
}

export const ClubService = {
    Login,
}




