// import React from 'react';
// import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
// import { Box, ButtonFixedFooterLayout, ButtonSecondary, Text4, ThemeContextProvider, VIVO_NEW_SKIN, getSkinByName, skinVars } from '@telefonica/mistica';
// import styles from './styles.module.css';

// export default function App() {
//   const width = global.window.innerWidth;
//   const height = global.window.innerHeight;

//   const aspectRatio = width / height;

//   const onNewScanResult = (decodedText: string) => {
//     window.alert(decodedText);
//   }

//   const handleStartScanning = async (html5QrCode: Html5Qrcode) => {
//     const userAgent = navigator.userAgent;
//     const videoStream = await window.navigator.mediaDevices.getUserMedia({
//       video: {
//         facingMode: 'environment',
//         aspectRatio,
//       },
//       audio: false
//     });

//     try {
//       html5QrCode
//         .start(
//           videoStream.getVideoTracks()[0].id,
//           {
//             fps: 10,
//             videoConstraints: {
//               facingMode: 'environment',
//               zoom: userAgent.match(/IPHONE/i) ? 4 : 1.5,
//               aspectRatio,
//             },
//           },
//           onNewScanResult,
//           () => {
//             return;
//           },
//         )
//         .catch(() => {
//           console.error('VOCÊ NÃO TEM PERMISSÃO');
//         });
//     } catch {
//       if (userAgent.match(/Android/i))
//         console.log('ACEITE A PERMISSÃO');
//       else {
//         console.error('VOCÊ NÃO TEM PERMISSÃO');
//       }
//     }
//   };

//   React.useEffect(() => {
//     const html5QrCode = new Html5Qrcode('video-area', {
//       useBarCodeDetectorIfSupported: true,
//       verbose: false,
//       formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
//     });

//     handleStartScanning(html5QrCode);

//     return () => {
//       html5QrCode
//         .stop()
//         .then(() => {
//           return;
//         })
//         .catch(() => {
//           return;
//         });
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <ThemeContextProvider theme={{
//       skin: getSkinByName(VIVO_NEW_SKIN),
//       colorScheme: 'light',
//       i18n: {
//         locale: 'pt-BR',
//         phoneNumberFormattingRegionCode: 'BR',
//       },

//     }}>
//       <ButtonFixedFooterLayout
//         isFooterVisible
//         containerBgColor={'#000000'}
//         footerBgColor={'#000000'}
//         button={
//           <ButtonSecondary
//             onPress={() => {
//               window.alert(aspectRatio);
//             }}
//             style={{
//               background:
//                 skinVars.colors.buttonSecondaryBorderInverse,
//             }}
//           >
//             {'Digitar código'}
//           </ButtonSecondary>
//         }
//       >
//         <Box className={styles.overlay}>
//           <Box className={styles.header}>
//             <Box className={styles.info_header}>
//               <Text4
//                 textAlign="center"
//                 medium
//                 color={skinVars.colors.textPrimaryInverse}
//               >
//                 {'Posicione o código de barras na linha'}
//               </Text4>
//               <Text4
//                 textAlign="center"
//                 medium
//                 color={skinVars.colors.textPrimaryInverse}
//               >
//                 {'e aguarde a leitura automática'}
//               </Text4>
//             </Box>
//           </Box>
//           <Box className={styles.scanning_area}>
//             <div
//               id="video-area"
//               data-testid="video"
//               className={styles.videos}
//             />
//             <hr
//               className={styles.divider}
//               style={{
//                 backgroundColor: `${skinVars.colors.buttonPrimaryBackground}`,
//                 borderColor: `${skinVars.colors.buttonPrimaryBackground}`,
//               }}
//             />
//           </Box>
//         </Box>
//       </ButtonFixedFooterLayout>
//     </ThemeContextProvider>
//   );
// }


import React from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { Box, ButtonFixedFooterLayout, ButtonSecondary, Text4, ThemeContextProvider, VIVO_NEW_SKIN, getSkinByName, skinVars } from '@telefonica/mistica';
import styles from './styles.module.css';

export default function App() {
  const width = global.window.innerWidth;
  const height = global.window.innerHeight;
  let dev = "";
  let devId: any;

  const aspectRatio = width / height;

  const onNewScanResult = (decodedText: string) => {
    window.alert(decodedText);
  }

  const handleStartScanning = async (html5QrCode: Html5Qrcode) => {
    const userAgent = navigator.userAgent;
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment',
      },
      audio: false
    });

    const videoStream2 = await navigator.mediaDevices.getSupportedConstraints() ;

    let devi = await window.navigator.mediaDevices.enumerateDevices();
    // dev = devi.length + " ";
    let videoDevices: Array<MediaDeviceInfo> = [];
    let videoDevicesOk: any;
    await devi.forEach((device: MediaDeviceInfo) => {
      if (device.kind == 'videoinput' && device.label.match(/back/i)) {
        videoDevices.push(device);
      }
    });
    
    dev += JSON.stringify(videoStream.getVideoTracks());
    
    // for (let i in videoDevices) {
    //   const device = videoDevices[i];
    //   // dev += "Opening video device " + device.deviceId + " (" + device.label + ")" ;
    //   const stream = await window.navigator.mediaDevices.getUserMedia({ video: { deviceId:  device.deviceId} });
    //   stream.getVideoTracks()[i].getCapabilities();
    //   if(stream.getVideoTracks()[i].getCapabilities().facingMode?.indexOf("continuous") != -1){
    //     devId = device.deviceId;
    //     videoDevicesOk = stream.getVideoTracks()[i].id;
    //   }


    //   // stream.getVideoTracks().forEach(track => {
    //   //   const capabilities = track.getCapabilities();
    //   //   if(capabilities.facingMode?.indexOf("continuous") != -1){
    //   //     devId = capabilities.deviceId;
    //   //   }
    //   //   // console.log(capabilities);
    //   //   // const settings = track.getSettings();
    //   //   // // console.log(settings);
    //   //   // console.log('');
    //   // }
    //   // )

    //   // stream.getTracks().forEach(track => track.stop());
    // }

    try {
      html5QrCode
        .start(
          videoStream.getVideoTracks()[0].id,
          {
            fps: 10,
            videoConstraints: {
              facingMode: 'environment',
              focusMode: {exact: "continuous"},
              zoom: userAgent.match(/IPHONE/i) ? 4 : 1.5,
              aspectRatio,
            },
          },
          onNewScanResult,
          () => {
            return;
          },
        )
        .catch(() => {
          console.error('VOCÊ NÃO TEM PERMISSÃO');
        });
    } catch {
      if (userAgent.match(/Android/i))
        console.log('ACEITE A PERMISSÃO');
      else {
        console.error('VOCÊ NÃO TEM PERMISSÃO');
      }
    }

    
    

  };

  React.useEffect(() => {
    const html5QrCode = new Html5Qrcode('video-area', {
      useBarCodeDetectorIfSupported: true,
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128],
    });

    handleStartScanning(html5QrCode);

    return () => {
      html5QrCode
        .stop()
        .then(() => {
          return;
        })
        .catch(() => {
          return;
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ThemeContextProvider theme={{
      skin: getSkinByName(VIVO_NEW_SKIN),
      colorScheme: 'light',
      i18n: {
        locale: 'pt-BR',
        phoneNumberFormattingRegionCode: 'BR',
      },

    }}>
      <ButtonFixedFooterLayout
        isFooterVisible
        containerBgColor={'#000000'}
        footerBgColor={'#000000'}
        button={
          <ButtonSecondary
            onPress={() => {
              window.alert(dev);
            }}
            style={{
              background:
                skinVars.colors.buttonSecondaryBorderInverse,
            }}
          >

            {'Digitar código'}
          </ButtonSecondary>
        }
      >
        <Box className={styles.overlay}>
          <Box className={styles.header}>
            <Box className={styles.info_header}>
              <Text4
                textAlign="center"
                medium
                color={skinVars.colors.textPrimaryInverse}
              >
                {`ola`}
              </Text4>
              { <Text4
                textAlign="center"
                medium
                color={skinVars.colors.textPrimaryInverse}
              >
                {'e aguarde a leitura automática'}
              </Text4> }
            </Box>
          </Box>
          <Box className={styles.scanning_area}>
            <div
              id="video-area"
              data-testid="video"
              className={styles.videos}
            />
            <hr
              className={styles.divider}
              style={{
                backgroundColor: `${skinVars.colors.buttonPrimaryBackground}`,
                borderColor: `${skinVars.colors.buttonPrimaryBackground}`,
              }}
            />
          </Box>
        </Box>
      </ButtonFixedFooterLayout>
    </ThemeContextProvider>
  );
}
