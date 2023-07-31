export default function () {
    const getProfileMenu = () => {

        return new Promise((resolve, reject) => {
            resolve([
                {action: "profile", title: "Perfil", icon: "account_box"},
                {action: "plan", title: "Mi plan", icon: "dvr"},
                //{action: "change_password", title: "Cambiar contraseña", icon: "lock"},
                {action: "disable_account", title: "Desvincular cuenta", icon: "disabled_by_default"},
                {action: "parental_control", title: "Control parental", icon: "supervisor_account"},
                {action: "logout", title: "Cerrar sesión", icon: "logout"},
            ])
        })
    }

    const getProfileInfo = () => {
        return new Promise((resolve, reject) => {
            resolve({
                name: "Martin Lecaros",
                email: "mlecaros@micorreo.com"
            })
        })
    }

    const getPlanInfo = () => {
        return new Promise((resolve, reject) => {
            resolve({
                associatedPlan: "Plan familiar",
                vigency: {
                    from : "01/01/2023",
                    to: "01/12/2023"
                },
                other_plans: [
                    {
                        name: "Plan Individual",
                        channelsCount: 90,
                        deviceCount: 1,
                        amount: "4000"
                    }
                ]
            })
        })
    }

    const changePassword = (emailAssociated) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(emailAssociated), 2000)
        })
    }

    return {
        getProfileMenu,
        getProfileInfo,
        getPlanInfo,
        changePassword
    }
}