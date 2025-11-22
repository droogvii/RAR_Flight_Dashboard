const localDashboardVersions = {
    "DNR Endurance Dashboard": "1.0.7"
};

function dnr_getLocalVersion(variantName) {
    return localDashboardVersions[variantName] || null;
}

function dnr_getOnlineVersion(variantName, jsonString) {
    try {
        const jsonData = JSON.parse(jsonString);
        const onlineDashboards = jsonData.dashboards;
        if (!onlineDashboards) return null;

        for (const dashboard of onlineDashboards) {
            for (const variant of dashboard.variants) {
                if (variant.name === variantName) {
                    return variant.version;
                }
            }
        }
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
    return null;
}

function dnr_isUpdateAvailable(variantName, jsonString) {
    try {
        const jsonData = JSON.parse(jsonString);
        const onlineDashboards = jsonData.dashboards;
        if (!onlineDashboards) return false;

        const localVersion = dnr_getLocalVersion(variantName);
        if (!localVersion) {
            return false;
        }

        for (const dashboard of onlineDashboards) {
            for (const variant of dashboard.variants) {
                if (variant.name === variantName) {
                    return dnr_compareVersions(localVersion, variant.version);
                }
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}

function dnr_getUpdateMessage(variantName, jsonString) {
    const onlineVersion = dnr_getOnlineVersion(variantName, jsonString);
    return `NEW VERSION ${onlineVersion} AVAILABLE TO DOWNLOAD`;
}

function dnr_compareVersions(localVersion, onlineVersion) {
    const localParts = localVersion.split(".").map(Number);
    const onlineParts = onlineVersion.split(".").map(Number);
    
    for (let i = 0; i < 3; i++) {
        if ((onlineParts[i] || 0) > (localParts[i] || 0)) {
            return true;
        } else if ((onlineParts[i] || 0) < (localParts[i] || 0)) {
            return false;
        }
    }
    return false;
}