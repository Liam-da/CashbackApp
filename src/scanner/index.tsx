import { ScanningFlow } from './ScanningFlow'; 

export default function ScanProdukt() {
    return (
        <ScanningFlow
            scanType="product"
            onComplete={(points: number) => console.log('points: ', points)}
            onBack={() => window.history.back()}
        />        
    );
}