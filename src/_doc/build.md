# Prebuild + Build

```sh
npx expo prebuild

# android/local.properties
sdk.dir=C:\\Users\\Frank\\AppData\\Local\\Android\\Sdk

adb uninstall com.frankgp.dev
npx expo run:android
npx expo run:ios

adb uninstall com.frankgp.dev
adb shell am start -a android.intent.action.VIEW -d "market://details?id=com.frankgp.dev"

# Open / Stop
adb shell am force-stop com.frankgp.dev
adb shell am start -n com.frankgp.dev/.MainActivity

# android\gradle.properties
MYAPP_STORE_FILE=../../_credentials/my_keystore_pkcs12.jks
MYAPP_STORE_PASSWORD=my_key_store_password
MYAPP_KEY_ALIAS=my_key_alias
MYAPP_KEY_PASSWORD=my_key_store_password

```

```js
// android\app\build.gradle
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_STORE_FILE')) {
                storeFile file(MYAPP_STORE_FILE)
                storePassword MYAPP_STORE_PASSWORD
                keyAlias MYAPP_KEY_ALIAS
                keyPassword MYAPP_KEY_PASSWORD
            }
        }
    }

    buildTypes {
      release {
          signingConfig signingConfigs.release
      }
    }
```

```sh

cd android

# build
./gradlew bundleRelease
# android/app/build/outputs/bundle/release/app-release.aab

# install and build
npm run build && npx expo run:android

# Filtrar solo tus apps
adb shell pm list packages | grep ivana
adb shell pm list packages | grep frank

npx expo run:android --variant devDebug

```
