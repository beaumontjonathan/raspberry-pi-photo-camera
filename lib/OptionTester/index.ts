export type OptionName = string;

interface ParameterOption {
    isNull?: boolean;

    isNumeric?: boolean;
    isInteger?: boolean;
    minValue?: number;
    maxValue?: number;

    useRegex?: boolean;
    regex?: RegExp;

    isSelect?: boolean;
    selectOptions?: any[];
}

interface NumericOption extends ParameterOption {
    isNumeric: boolean;
    isInteger?: boolean;
    minValue?: number;
    maxValue?: number;
}

interface NullOption extends ParameterOption {
    isNull: boolean;
}

interface RegexOpton extends ParameterOption {
    useRegex: boolean;
    regex: RegExp;
}

interface SelectOption extends ParameterOption {
    isSelect: true;
    selectOptions: any[];
}

export class OptionTester {
    private static readonly options: Map<OptionName, ParameterOption> = new Map([
        ['width', { isNumeric: true, isInteger: true, minValue: 1 }],
        ['height', { isNumeric: true, isInteger: true, maxValue: 1 }],
        ['timeout', { isNumeric: true, isInteger: true, isRanged: true, minValue: 0, maxValue: Infinity }],
    ]);

    public static hasOption(option: OptionName): boolean {
        return OptionTester.options.has(option);
    }

    private static enforceHasOption(option: OptionName): void {
        if (!OptionTester.hasOption(option)) {
            throw new Error('Invalid camera option');
        }
    }

    private static getOptionParameters(option: OptionName): ParameterOption {
        OptionTester.enforceHasOption(option);

        return OptionTester.options.get(option);
    }

    public static ensureValidOption(optionName: OptionName, optionValue: any): void {
        OptionTester.enforceHasOption(optionName);

        const params = OptionTester.getOptionParameters(optionName);

        if (params.isNull) OptionTester.ensureValidNulOption(optionName, optionValue);
        if (params.isNumeric) OptionTester.ensureValidNumericOption(optionName, params, optionValue);
        if (params.useRegex) OptionTester.ensureValidRegexOption(optionName, params, optionValue);
        if (params.isSelect) OptionTester.ensureValidSelectOption(optionName, params, optionValue);

    }

    private static ensureValidNumericOption(optionName: OptionName, {isInteger, minValue, maxValue}: ParameterOption, optionValue: any): void {
        const numericValue = Number(optionValue);
        const stringValue = `${optionValue}`;

        if (isNaN(numericValue) || `${numericValue}` !== stringValue) throw OptionTester.buildInvalidOptionError(optionName, 'be a number', optionValue);
        if (minValue && numericValue < minValue) throw OptionTester.buildInvalidOptionError(optionName, `not be smaller than ${minValue}`, optionValue);
        if (minValue && numericValue > maxValue) throw OptionTester.buildInvalidOptionError(optionName, `not be greater than ${maxValue}`, optionValue);
        if (isInteger && !Number.isInteger(numericValue)) throw OptionTester.buildInvalidOptionError(optionName, 'be an integer', optionValue);

    }

    private static ensureValidNulOption(optionName: OptionName, optionValue: any): void {
        if (!optionValue) throw OptionTester.buildInvalidOptionError(optionName, 'be null', optionValue);
    }

    private static ensureValidRegexOption(optionName: OptionName, { regex }: ParameterOption, optionValue: any): void {
        if (!regex.test(optionValue)) throw OptionTester.buildInvalidOptionError(optionName, `match the regex ${regex}`, optionValue);
    }

    private static ensureValidSelectOption(optionName: OptionName, params: ParameterOption, optionValue: any): void {
        if (!params.selectOptions.includes(optionValue)) throw OptionTester.buildInvalidOptionError(optionName, `be in the array ${params.selectOptions}`, optionValue);
    }

    private static buildInvalidOptionError(optionName: OptionName, mustStatement: string, value: any): Error {
        return new Error(`Invalid option: ${optionName} must ${mustStatement}. You provided the value ${value}.`);
    }
}

/*
    options:
    -w, --width	: Set image width <size>
    -h, --height	: Set image height <size>
    -q, --quality	: Set jpeg quality <0 to 100>
    -r, --raw	: Add raw bayer data to jpeg metadata
    -t, --timeout	: Time (in ms) before takes picture and shuts down (if not specified, set to 5s)
    -th, --thumb	: Set thumbnail parameters (x:y:quality) or none
    -e, --encoding	: Encoding to use for output file (jpg, bmp, gif, png)
    -tl, --timelapse	: Timelapse mode. Takes a picture every <t>ms. %d == frame number (Try: -o img_%04d.jpg)
    -bm, --burst	: Enable 'burst capture mode'
    -md, --mode	: Force sensor mode. 0=auto. See docs for other modes available
    -dt, --datetime	: Replace output pattern (%d) with DateTime (MonthDayHourMinSec)
    -ts, --timestamp	: Replace output pattern (%d) with unix timestamp (seconds since 1970)
    -fs, --framestart	: Starting frame number in output pattern(%d)
    -rs, --restart	: JPEG Restart interval (default of 0 for none)

    image options:
    -sh, --sharpness	: Set image sharpness (-100 to 100)
    -co, --contrast	: Set image contrast (-100 to 100)
    -br, --brightness	: Set image brightness (0 to 100)
    -sa, --saturation	: Set image saturation (-100 to 100)
    -ISO, --ISO	: Set capture ISO
    -vs, --vstab	: Turn on video stabilisation
    -ev, --ev	: Set EV compensation - steps of 1/6 stop
    -ex, --exposure	: Set exposure mode (off,auto,night,nightpreview,backlight,spotlight,sports,snow,beach,verylong,fixedfps,antishake,fireworks)
    -fli, --flicker	: Set flicker avoid mode (off,auto,50hz,60hz)
    -awb, --awb	: Set AWB mode (off,auto,sun,cloud,shade,tungsten,fluorescent,incandescent,flash,horizon)
    -ifx, --imxfx	: Set image effect (none,negative,solarise,sketch,denoise,emboss,oilpaint,hatch,gpen,pastel,watercolour,film,blur,saturation,colourswap,washedout,posterise,colourpoint,colourbalance,cartoon)
    -cfx, --colfx	: Set colour effect (U:V)
    -mm, --metering	: Set metering mode (average,spot,backlit,matrix)
    -rot, --rotation	: Set image rotation (0-359)
    -hf, --hflip	: Set horizontal flip
    -vf, --vflip	: Set vertical flip
    -roi, --roi	: Set region of interest (x,y,w,d as normalised coordinates [0.0-1.0])
    -ss, --shutter	: Set shutter speed in microseconds
    -awbg, --awbgains	: Set AWB gains - AWB mode must be off
    -drc, --drc	: Set DRC Level (off,low,med,high)
    -st, --stats	: Force recomputation of statistics on stills capture pass
    -a, --annotate	: Enable/Set annotate flags or text
    -3d, --stereo	: Select stereoscopic mode
    -dec, --decimate	: Half width/height of stereo image
    -3dswap, --3dswap	: Swap camera order for stereoscopic
    -ae, --annotateex	: Set extra annotation parameters (text size, text colour(hex YUV), bg colour(hex YUV))
    -ag, --analoggain	: Set the analog gain (floating point)
    -dg, --digitalgain	: Set the digital gain (floating point)
 */