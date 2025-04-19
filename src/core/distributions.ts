export type NormalDistributionParameters = {
  mean: number;
  stddev: number;
};

export function sampleNormalDistribution({
  mean,
  stddev,
}: NormalDistributionParameters): number {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stddev + mean;
}

export class NormalDistribution {
  constructor(private parameters: NormalDistributionParameters) {}
  sample(): number {
    return sampleNormalDistribution(this.parameters);
  }
  sampleMany(n: number): number[] {
    return Array.from({ length: n }, () => this.sample());
  }
  valueAt(x: number): number {
    const { mean, stddev } = this.parameters;
    return (
      (1 / (stddev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((x - mean) / stddev, 2))
    );
  }
  valueAtMany(xs: number[]): number[] {
    return xs.map(x => this.valueAt(x));
  }
  valueForSigma(sigma: number): void {}
  get mean(): number {
    return this.parameters.mean;
  }
  get stddev(): number {
    return this.parameters.stddev;
  }
}
