import { Loader } from "lucide-react";

type SpinnerSize = 'sm' | 'default' | 'lg';

interface SpinnerProps {
    size?: SpinnerSize;
}

const sizeMap: Record<SpinnerSize, string> = {
    sm: 'h-2 w-2',
    default: 'h-4 w-4',
    lg: 'h-6 w-6',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'default' }) => {
    return <Loader className={sizeMap[size]} />;
};

export default Spinner;
