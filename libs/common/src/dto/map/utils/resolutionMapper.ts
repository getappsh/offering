
export class ResolutionMapper {

 static mappings = {
    0: 0.703125,
    1: 0.3515625,
    2: 0.17578125,
    3: 0.087890625,
    4: 0.043945313,
    5: 0.021972656,
    6: 0.010986328,
    7: 0.005493164,
    8: 0.002746582,
    9: 0.001373291,
    10: 0.000686646,
    11: 0.000343323,
    12: 0.000171661,
    13: 8.58307E-05,
    14: 4.29153E-05,
    15: 2.14577E-05,
    16: 1.07288E-05,
    17: 5.36442E-06,
    18: 2.68221E-06,
    19: 1.34110E-06,
    20: 6.70552E-07,
    21: 3.35276E-07,
  }

  static level2Resolution(level: number): number {
    if (this.mappings[level]) {
      return this.mappings[level]
    }
    return 0.0
  }

  static resolution2Level(resolution: number) {
    const level = Object.entries(this.mappings).find(mapper => mapper[1] === resolution)
    return Number(level[0])
  }

  static getLevels(){
    return Object.keys(this.mappings);
}

}

