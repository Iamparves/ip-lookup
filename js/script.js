const ipToken = 'd343426e35f236';

const displayPublicIP = () => {
    fetch(`https://ipinfo.io/json?token=${ipToken}`)
        .then(res => res.json())
        .then(data => {
            document.querySelector('.publicIP').innerText = data.ip;
            displayLookupData(data);
        })
}

displayPublicIP()

const displayLookupData = async data => {
    if (!data.timezone) {
        displayWarning('Please write a correct public ip address');
        return;
    }
    const lookupResult = document.querySelector('.lookup__result');
    lookupResult.innerHTML = '<div class="kinetic"></div>';

    let { ip, city, country, timezone, org } = data;
    country = await getCountry(country);
    org = org.split(" ");
    org.shift()
    org = org.join(' ');

    const lookupTable = `
                        <table class="lookup__table">
                            <tr>
                                <td>IP</td>
                                <td>${ip}</td>
                            </tr>
                            <tr>
                                <td>City</td>
                                <td>${city}</td>
                            </tr>
                            <tr>
                                <td>Country</td>
                                <td class="flag">${country.name} <img src="${country.flag}" alt="${country.name}"></td>
                            </tr>
                            <tr>
                                <td>Timezone</td>
                                <td>${timezone}</td>
                            </tr>
                            <tr>
                                <td>ISP</td>
                                <td>${org}</td>
                            </tr>
                        </table>
                        `
    lookupResult.innerHTML = lookupTable;
}

const getCountry = async (countryCode) => {
    const res = await fetch(`https://restcountries.eu/rest/v2/alpha/${countryCode}`)
    const data = await res.json();

    return data;
}

const loadLookupData = () => {
    const lookupIP = document.querySelector('.lookup__input').value;

    if (!lookupIP) {
        displayWarning('Please write an IP address for lookup');
        return;
    }

    fetch(`https://ipinfo.io/${lookupIP}?token=${ipToken}`)
        .then(res => res.json())
        .then(data => displayLookupData(data))
}

document.querySelector('.lookup__btn').addEventListener('click', loadLookupData);
document.querySelector('.lookup__input').addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        loadLookupData();
    }
});

const displayWarning = message => {
    const warning = document.querySelector('.warning');
    const warningMessage = document.querySelector('.warning__message');

    warningMessage.innerText = message;
    warning.classList.add('visible');

    setTimeout(function () {
        warning.classList.remove('visible');
    }, 2000)
}