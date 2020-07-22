#!/bin/bash
#set -x

#
# MIPS
#

echo " MIPS: examples"
MIPS_TEST="2 3 4 5 6 7 8 11"
for I in $MIPS_TEST;
do
   echo -n " * ./travis/MIPS/correct/example$I: "
   ./creator.sh -a ./architecture/MIPS-32-like.json \
                -s ./travis/MIPS/correct/example$I.txt \
                -r ./travis/MIPS/correct/example$I.output --quiet
done

echo " MIPS: common errors"
MIPS_TEST="1 2"
for I in $MIPS_TEST;
do
   echo " * ./travis/MIPS/error/error$I: "
   ./creator.sh -a ./architecture/MIPS-32-like.json \
                -s ./travis/MIPS/error/error$I.txt \
                -r ./travis/MIPS/error/error$I.output --quiet
done


#
# RISC-V
#

echo " RISC-V:"
RV_TEST="1"
for I in $RV_TEST;
do
  echo -n " * ./travis/riscv/correct/example$I: "
  ./creator.sh -a ./architecture/RISC-V-like.json \
               -s ./travis/riscv/correct/example$I.txt \
               -r ./travis/riscv/correct/example$I.output --quiet
done

